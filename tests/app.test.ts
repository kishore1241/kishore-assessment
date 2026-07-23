import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { clearStoreForTests } from "../src/urlShortener/store.js";

describe("assessment prototype API", () => {
  beforeEach(() => {
    clearStoreForTests();
  });

  it("analyzes the mandatory URL shortener requirement", async () => {
    const app = createApp();

    const response = await request(app).post("/api/assessment/analyze").send({
      requirement: "Build a scalable URL shortener service with APIs, persistence, and analytics."
    });

    expect(response.status).toBe(200);
    expect(response.body.scenario).toBe("greenfield");
    expect(response.body.tasks.length).toBeGreaterThanOrEqual(4);
  });

  it("creates and resolves a short URL", async () => {
    const app = createApp();

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
});
