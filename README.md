# AI-Assisted Software Engineering Assessment Prototype

This repository is a standalone, non-Verizon project for interview assessment work.

## What It Demonstrates
- Engineer-led requirement analysis with AI-assist framing.
- Mandatory URL shortener use case with APIs, redirect, and click analytics.
- Runnable service, minimal web UI, tests, and documentation.

## Tech Stack
- Node.js + TypeScript
- Express
- Vitest + Supertest
- ESLint + Prettier

## Run Locally
1. Install dependencies:
   - `npm install`
2. Run migrations:
   - `npm run migrate`
3. Start dev server:
   - `npm run dev`
4. Open browser:
   - `http://localhost:3000`

## Validate
- `npm run lint`
- `npm run build`
- `npm test`

## API Endpoints
- `POST /api/assessment/analyze`
- `POST /api/assessment/report`
- `POST /api/assessment/report/export`
- `POST /api/short-urls`
- `GET /api/short-urls`
- `GET /api/short-urls/:code`
- `GET /s/:code`
- `GET /api/analytics/summary?sinceHours=24`
- `GET /api/analytics/top-links?sinceHours=24&limit=10`

## Security Controls
- URL policy hardening for short-link creation:
   - only `http` and `https` targets are allowed
   - localhost, private network ranges, and `.local` hosts are blocked
   - optional allowlist/blocklist via environment variables
- Rate limiting on `POST /api/short-urls`

Environment variables:
- `ALLOWED_HOSTS` (comma-separated host allowlist, optional)
- `BLOCKED_HOSTS` (comma-separated host blocklist, optional)
- `SQLITE_DB_PATH` (optional, defaults to `data/app.db`)
- `REVIEWER_API_KEY` (optional, enables API key protection for all /api routes)

Report export formats via `POST /api/assessment/report/export`:
- `markdown`
- `html`
- `pdf`

## Scope Notes
This implementation uses SQLite persistence through sql.js with migrations stored in `migrations/` and a local database file at `data/app.db`.
