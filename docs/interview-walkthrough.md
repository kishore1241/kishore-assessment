# Interview Walkthrough (5-7 Minutes)

## 0:00 to 0:45 - Context and Objective
- This is a standalone assessment project, separate from proprietary work.
- Goal: show engineer-led AI-assisted execution, not autonomous AI control.
- Mandatory scenario included: scalable URL shortener with APIs, persistence, and analytics.

## 0:45 to 2:00 - Requirement to Structured Engineering Output
- Demo endpoint: POST /api/assessment/analyze.
- Show the mandatory input requirement.
- Highlight output fields:
  - scenario classification (greenfield/brownfield/ambiguous)
  - clarified problem statement
  - ordered task decomposition with AI assist and validation ownership
  - assumptions, risks, and trade-offs

## 2:00 to 3:15 - URL Shortener Runtime Flow
- Create link: POST /api/short-urls.
- Resolve redirect: GET /s/:code.
- Inspect link state: GET /api/short-urls/:code.
- Explain persistence path:
  - sql.js-backed SQLite storage
  - migration files under migrations/

## 3:15 to 4:15 - Analytics and Security Controls
- Analytics summary: GET /api/analytics/summary?sinceHours=24
- Top links: GET /api/analytics/top-links?sinceHours=24&limit=10
- Security controls:
  - URL policy blocks localhost/private ranges
  - optional allow/block host policy
  - request throttling on short-link creation
  - optional API key reviewer mode via REVIEWER_API_KEY

## 4:15 to 5:30 - Final Engineering Report and Export
- Generate markdown summary: POST /api/assessment/report
- Export endpoint: POST /api/assessment/report/export
  - markdown
  - html
  - pdf
- Explain why this supports submission and review workflows.

## 5:30 to 7:00 - Validation, Risks, and Trade-offs
- Show checks:
  - npm run migrate
  - npm run lint
  - npm run build
  - npm test
- Mention known limitations:
  - basic auth mode is API key only
  - analytics are intentionally lean
  - no distributed rate limiter in this version
- Close with next hardening steps if needed.
