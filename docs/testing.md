# Testing Approach

## Automated
- Unit/behavior tests via Vitest and Supertest.
- Coverage focus:
  - Requirement analysis output shape and scenario classification.
  - Brownfield and ambiguous requirement classification.
  - Short URL creation endpoint.
  - URL policy rejection for local/private targets.
  - Rate limiting on create endpoint.
  - Redirect and click analytics increment.
  - Analytics summary and top-links endpoints.
  - Submission-ready report generation endpoint.

## Manual
- Use the web page at / to submit requirement text and inspect structured output.
- Use the report button to generate and inspect the markdown engineering summary.
- Create short links and visit /s/{code} to validate redirect and click count.

## Known Limitations
- Storage is file-backed SQLite via sql.js and local to the runtime environment.
- Rate limiting is implemented for short-link creation only; broader authN/authZ is not yet implemented.
- Analytics are intentionally minimal (count + timestamp) and can be expanded for production reporting.
