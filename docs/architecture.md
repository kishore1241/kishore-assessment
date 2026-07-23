# Architecture Overview

## Goal
Provide a standalone assessment project that demonstrates engineer-led AI-assisted software delivery with a mandatory URL shortener use case.

## Components
- Requirement Analysis Module: classifies requirement scenario and produces engineering task breakdown.
- Engineering Report Module: generates submission-ready markdown summaries with tasks, risks, and trade-offs.
- URL Shortener Module: creates short codes, resolves redirects, and tracks clicks.
- SQLite Persistence Module: stores short URLs and click events using sql.js and migration files.
- Security Policy Module: enforces URL safety and request throttling.
- Analytics Module: provides time-window summary and top-links reporting endpoints.
- API Layer: exposes analysis and shortener endpoints.
- Web Demo UI: quick way to run flows manually.
- Test Suite: validates behavior and protects regressions.

## Design Decisions
- Keep implementation intentionally lightweight for interview turnaround.
- Ensure deterministic tests and no external AI service dependency for baseline reliability.
- Use SQL migrations under `migrations/` and file-backed storage at `data/app.db`.
- Keep API contracts simple and modular so storage can later move to Postgres/MySQL with minimal surface changes.
- Default security posture rejects local/private URL targets and applies create-endpoint rate limits.
