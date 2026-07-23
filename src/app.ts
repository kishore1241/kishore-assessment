import cors from "cors";
import express from "express";
import { z } from "zod";
import { analyzeRequirement } from "./analysis/requirementAnalyzer.js";
import { createShortUrl, getShortUrl, listShortUrls, recordClick } from "./urlShortener/store.js";

const analyzeSchema = z.object({
  requirement: z.string().min(10).max(5000)
});

const createSchema = z.object({
  originalUrl: z.url(),
  customCode: z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/)
    .max(32)
    .optional()
});

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

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

  app.post("/api/short-urls", (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }

    try {
      const record = createShortUrl(parsed.data.originalUrl, parsed.data.customCode);
      return res.status(201).json({
        ...record,
        shortUrl: `/s/${record.code}`
      });
    } catch {
      return res.status(409).json({ error: "Custom code already exists" });
    }
  });

  app.get("/api/short-urls", (_req, res) => {
    return res.json({ items: listShortUrls() });
  });

  app.get("/api/short-urls/:code", (req, res) => {
    const record = getShortUrl(req.params.code);
    if (!record) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(record);
  });

  app.get("/s/:code", (req, res) => {
    const updated = recordClick(req.params.code);
    if (!updated) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(302, updated.originalUrl);
  });

  return app;
}
