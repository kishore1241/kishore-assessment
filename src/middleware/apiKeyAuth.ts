import { NextFunction, Request, Response } from "express";

export function createApiKeyAuth(expectedApiKey?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!expectedApiKey || expectedApiKey.trim().length === 0) {
      next();
      return;
    }

    const provided = req.header("x-api-key")?.trim();
    if (!provided || provided !== expectedApiKey) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Valid x-api-key header required"
      });
      return;
    }

    next();
  };
}