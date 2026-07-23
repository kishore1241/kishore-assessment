# Testing Approach

## Automated
- Unit/behavior tests via Vitest and Supertest.
- Coverage focus:
  - Requirement analysis output shape and scenario classification.
  - Short URL creation endpoint.
  - Redirect and click analytics increment.

## Manual
- Use the web page at / to submit requirement text and inspect structured output.
- Create short links and visit /s/{code} to validate redirect and click count.

## Known Limitations
- Current short URL storage is in-memory and resets on restart.
- No authentication/rate limiting in this initial scaffold.
