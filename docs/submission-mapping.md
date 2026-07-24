# Submission Mapping (Assignment Requirement Coverage)

## 1) Requirement Understanding
Coverage:
- Requirement parsing, scenario classification, and ambiguity detection:
  - src/analysis/requirementAnalyzer.ts
- Structured analysis endpoint:
  - POST /api/assessment/analyze (src/app.ts)

## 2) Task Decomposition (Engineer-led)
Coverage:
- Deterministic task decomposition with AI-assist and validation notes:
  - src/analysis/requirementAnalyzer.ts
- Report generation includes ordered task list and validation fields:
  - POST /api/assessment/report (src/app.ts)

## 3) AI-Assisted Development
Coverage:
- AI usage modeled in outputs (assist + validation ownership fields):
  - src/analysis/requirementAnalyzer.ts
- Engineer ownership visible in generated report structure:
  - src/analysis/requirementAnalyzer.ts
- Explicit AI usage narrative and accepted/rejected patterns:
  - docs/ai-usage-evidence.md

## 4) Engineering Output Generation
Coverage:
- Working APIs, persistence, and redirects:
  - src/app.ts
  - src/urlShortener/sqliteStore.ts
  - src/db/sqliteClient.ts
  - src/db/migrate.ts
  - migrations/*.sql
- Demo UI for manual walkthrough:
  - public/index.html
- Tests validating behavior:
  - tests/app.test.ts
- Lightweight API contract documentation:
  - docs/api-contracts.md

## 5) Validation and Quality Assurance
Coverage:
- Automated checks:
  - npm run lint
  - npm run build
  - npm test
- Test coverage for:
  - URL creation, redirect, click tracking
  - scenario classification (greenfield/brownfield/ambiguous)
  - report generation
  - report export (html/pdf)
  - policy enforcement and rate limiting
  - optional API key protection mode

## 6) Risk Awareness
Coverage:
- Risks and trade-offs explicitly generated in analysis output:
  - src/analysis/requirementAnalyzer.ts
- Security controls:
  - URL target hardening (src/security/urlPolicy.ts)
  - Create endpoint throttling (src/middleware/rateLimit.ts)

## 7) Final Engineering Output
Coverage:
- Submission-ready markdown report endpoint:
  - POST /api/assessment/report
- Exportable report endpoint:
  - POST /api/assessment/report/export (markdown/html/pdf)
- Documentation:
  - README.md
  - docs/architecture.md
  - docs/testing.md
  - docs/submission-mapping.md
  - docs/example-scenarios.md
  - docs/api-contracts.md
  - docs/ai-usage-evidence.md
  - docs/interview-walkthrough.md

## Mandatory Use Case: URL Shortener
Coverage:
- Implemented with APIs, persistence, and analytics:
  - POST /api/short-urls
  - GET /s/:code
  - GET /api/analytics/summary
  - GET /api/analytics/top-links
  - SQLite-backed storage and migration files
