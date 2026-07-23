import cors from "cors";
import express from "express";
import { z } from "zod";
import { analyzeRequirement, generateEngineeringReport } from "./analysis/requirementAnalyzer.js";
import { generateReportPdfBuffer, renderReportHtml } from "./analysis/reportExport.js";
import { createApiKeyAuth } from "./middleware/apiKeyAuth.js";
import { createRateLimiter } from "./middleware/rateLimit.js";
import { createUrlPolicyFromEnv, validateTargetUrl } from "./security/urlPolicy.js";
import { createMemoryShortUrlStore } from "./urlShortener/memoryStore.js";
import { ShortUrlStore } from "./urlShortener/types.js";

const analyzeSchema = z.object({
  requirement: z.string().min(10).max(5000)
});

const reportSchema = z.object({
  requirement: z.string().min(10).max(5000)
});

const exportSchema = z.object({
  requirement: z.string().min(10).max(5000),
  format: z.enum(["markdown", "html", "pdf"]).default("html")
});

const createSchema = z.object({
  originalUrl: z.url(),
  customCode: z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/)
    .max(32)
    .optional()
});

const analyticsQuerySchema = z.object({
  sinceHours: z.coerce.number().int().positive().max(24 * 30).default(24),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export function createApp(options?: {
  store?: ShortUrlStore;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  reviewerApiKey?: string;
}) {
  const app = express();
  const store = options?.store ?? createMemoryShortUrlStore();
  const policy = createUrlPolicyFromEnv();
  const limiter = createRateLimiter(options?.rateLimit?.windowMs ?? 60_000, options?.rateLimit?.maxRequests ?? 30);
  const apiKeyAuth = createApiKeyAuth(options?.reviewerApiKey ?? process.env.REVIEWER_API_KEY);

  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));
  app.use("/api", apiKeyAuth);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/assessment/analyze", (req, res) => {
    const parsed = analyzeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }

    const analysis = analyzeRequirement(parsed.data.requirement);
    return res.status(200).json(analysis);
  });

  app.post("/api/short-urls", limiter, async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }

    const validation = validateTargetUrl(parsed.data.originalUrl, policy);
    if (!validation.allowed) {
      return res.status(422).json({
        error: "URL rejected by policy",
        reason: validation.reason
      });
    }

    try {
      const record = await store.createShortUrl(parsed.data.originalUrl, parsed.data.customCode);
      return res.status(201).json({
        ...record,
        shortUrl: `/s/${record.code}`
      });
    } catch {
      return res.status(409).json({ error: "Custom code already exists" });
    }
  });

  app.get("/api/short-urls", async (_req, res) => {
    const items = await store.listShortUrls();
    return res.json({ items });
  });

  app.get("/api/short-urls/:code", async (req, res) => {
    const record = await store.getShortUrl(req.params.code);
    if (!record) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(record);
  });

  app.get("/s/:code", async (req, res) => {
    const updated = await store.recordClick(req.params.code);
    if (!updated) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(302, updated.originalUrl);
  });

  app.post("/api/assessment/report", (req, res) => {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }

    const analysis = analyzeRequirement(parsed.data.requirement);
    const reportMarkdown = generateEngineeringReport(parsed.data.requirement, analysis);

    return res.status(200).json({
      analysis,
      reportMarkdown
    });
  });

  app.post("/api/assessment/report/export", async (req, res) => {
    const parsed = exportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }

    const analysis = analyzeRequirement(parsed.data.requirement);
    const markdown = generateEngineeringReport(parsed.data.requirement, analysis);

    if (parsed.data.format === "markdown") {
      res.setHeader("Content-Disposition", 'attachment; filename="engineering-summary.md"');
      res.type("text/markdown");
      return res.status(200).send(markdown);
    }

    if (parsed.data.format === "html") {
      const html = renderReportHtml(parsed.data.requirement, analysis);
      res.setHeader("Content-Disposition", 'attachment; filename="engineering-summary.html"');
      res.type("text/html");
      return res.status(200).send(html);
    }

    const pdfBuffer = await generateReportPdfBuffer(markdown);
    res.setHeader("Content-Disposition", 'attachment; filename="engineering-summary.pdf"');
    res.type("application/pdf");
    return res.status(200).send(pdfBuffer);
  });

  app.get("/api/analytics/summary", async (req, res) => {
    const parsed = analyticsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid query", details: parsed.error.flatten() });
    }

    const summary = await store.getAnalyticsSummary(parsed.data.sinceHours);
    return res.status(200).json(summary);
  });

  app.get("/api/analytics/top-links", async (req, res) => {
    const parsed = analyticsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid query", details: parsed.error.flatten() });
    }

    const links = await store.getTopLinks(parsed.data.limit, parsed.data.sinceHours);
    return res.status(200).json({
      sinceHours: parsed.data.sinceHours,
      limit: parsed.data.limit,
      items: links
    });
  });

  return app;
}
