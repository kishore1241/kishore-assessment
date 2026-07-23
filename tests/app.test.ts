import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { createMemoryShortUrlStore } from "../src/urlShortener/memoryStore.js";

describe("assessment prototype API", () => {
  const store = createMemoryShortUrlStore();

  beforeEach(() => {
    return store.clearForTests?.();
  });

  it("analyzes the mandatory URL shortener requirement", async () => {
    const app = createApp({ store });

    const response = await request(app).post("/api/assessment/analyze").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
    });

    expect(response.status).toBe(200);
    expect(response.body.domain).toBe("url_shortener");
    expect(response.body.scenario).toBe("greenfield");
    expect(response.body.tasks.length).toBeGreaterThanOrEqual(4);
  });

  it("classifies brownfield and ambiguous requirements", async () => {
    const app = createApp({ store });

    const brownfield = await request(app).post("/api/assessment/analyze").send({
      requirement: "Enhance existing short link service without changing redirect behavior."
    });

    expect(brownfield.status).toBe(200);
    expect(brownfield.body.scenario).toBe("brownfield");

    const ambiguous = await request(app).post("/api/assessment/analyze").send({
      requirement: "Maybe improve the short links experience somehow."
    });

    expect(ambiguous.status).toBe(200);
    expect(ambiguous.body.scenario).toBe("ambiguous");
  });

  it("creates and resolves a short URL", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 50 } });

    const create = await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/engineering-docs",
      customCode: "docs123"
    });

    expect(create.status).toBe(201);
    expect(create.body.code).toBe("docs123");

    const redirect = await request(app).get("/s/docs123");

    expect(redirect.status).toBe(302);
    expect(redirect.headers.location).toBe("https://example.com/engineering-docs");

    const stats = await request(app).get("/api/short-urls/docs123");

    expect(stats.status).toBe(200);
    expect(stats.body.clickCount).toBe(1);
  });

  it("rejects localhost and private network URLs", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 50 } });

    const localhost = await request(app).post("/api/short-urls").send({
      originalUrl: "http://127.0.0.1/internal"
    });

    expect(localhost.status).toBe(422);
    expect(localhost.body.error).toBe("URL rejected by policy");

    const privateRange = await request(app).post("/api/short-urls").send({
      originalUrl: "http://10.0.0.5/service"
    });

    expect(privateRange.status).toBe(422);
  });

  it("enforces rate limits on short URL creation", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 2 } });

    const first = await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/a"
    });
    const second = await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/b"
    });
    const third = await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/c"
    });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(third.status).toBe(429);
  });

  it("returns analytics summary and top links", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 50 } });

    await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/popular",
      customCode: "top1"
    });
    await request(app).post("/api/short-urls").send({
      originalUrl: "https://example.com/secondary",
      customCode: "top2"
    });

    await request(app).get("/s/top1");
    await request(app).get("/s/top1");
    await request(app).get("/s/top2");

    const summary = await request(app).get("/api/analytics/summary?sinceHours=24");
    expect(summary.status).toBe(200);
    expect(summary.body.totalClicks).toBe(3);
    expect(summary.body.uniqueLinks).toBe(2);

    const top = await request(app).get("/api/analytics/top-links?sinceHours=24&limit=5");
    expect(top.status).toBe(200);
    expect(top.body.items.length).toBeGreaterThanOrEqual(2);
    expect(top.body.items[0].code).toBe("top1");
    expect(top.body.items[0].clickCount).toBe(2);
  });

  it("generates a submission-ready engineering report", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 50 } });

    const response = await request(app).post("/api/assessment/report").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
    });

    expect(response.status).toBe(200);
    expect(response.body.reportMarkdown).toContain("# Engineering Summary");
    expect(response.body.reportMarkdown).toContain("## Task Decomposition");
    expect(response.body.reportMarkdown).toContain("Scenario: greenfield");
  });

  it("exports report as html and pdf", async () => {
    const app = createApp({ store, rateLimit: { windowMs: 60_000, maxRequests: 50 } });

    const html = await request(app).post("/api/assessment/report/export").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics.",
      format: "html"
    });

    expect(html.status).toBe(200);
    expect(String(html.headers["content-type"])).toContain("text/html");
    expect(String(html.headers["content-disposition"])).toContain("engineering-summary.html");
    expect(String(html.text)).toContain("Engineering Summary");

    const pdf = await request(app).post("/api/assessment/report/export").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics.",
      format: "pdf"
    });

    expect(pdf.status).toBe(200);
    expect(String(pdf.headers["content-type"])).toContain("application/pdf");
    expect(String(pdf.headers["content-disposition"])).toContain("engineering-summary.pdf");
  });

  it("supports api key protected mode for reviewer endpoints", async () => {
    const app = createApp({
      store,
      reviewerApiKey: "reviewer-secret",
      rateLimit: { windowMs: 60_000, maxRequests: 50 }
    });

    const denied = await request(app).post("/api/assessment/analyze").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
    });

    expect(denied.status).toBe(401);

    const allowed = await request(app)
      .post("/api/assessment/analyze")
      .set("x-api-key", "reviewer-secret")
      .send({
        requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
      });

    expect(allowed.status).toBe(200);
  });
});
