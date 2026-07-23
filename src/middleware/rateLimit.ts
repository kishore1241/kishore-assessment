import { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter(windowMs = 60_000, maxRequests = 30) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
    const now = Date.now();

    const existing = buckets.get(key);
    if (!existing || now > existing.resetAt) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs
      });
      next();
      return;
    }

    if (existing.count >= maxRequests) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfter)));
      res.status(429).json({
        error: "Rate limit exceeded",
        retryAfterSeconds: Math.max(1, retryAfter)
      });
      return;
    }

    existing.count += 1;
    buckets.set(key, existing);
    next();
  };
}