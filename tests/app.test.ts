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
    const app = createApp({ store });

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

  it("generates a submission-ready engineering report", async () => {
    const app = createApp({ store });

    const response = await request(app).post("/api/assessment/report").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
    });

    expect(response.status).toBe(200);
    expect(response.body.reportMarkdown).toContain("# Engineering Summary");
    expect(response.body.reportMarkdown).toContain("## Task Decomposition");
    expect(response.body.reportMarkdown).toContain("Scenario: greenfield");
  });
});
