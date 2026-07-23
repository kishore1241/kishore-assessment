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
2. Start dev server:
   - `npm run dev`
3. Open browser:
   - `http://localhost:3000`

## Validate
- `npm run lint`
- `npm run build`
- `npm test`

## API Endpoints
- `POST /api/assessment/analyze`
- `POST /api/short-urls`
- `GET /api/short-urls`
- `GET /api/short-urls/:code`
- `GET /s/:code`

## Scope Notes
This initial setup keeps persistence in memory to speed up delivery. A production follow-up can swap in a database-backed repository without changing API contracts.
