# API Contracts

## POST /api/assessment/analyze
Purpose:
- Convert a free-form requirement into a structured engineering analysis.

Request:
```json
{
  "requirement": "Build a scalable URL shortener service with APIs, persistence, and analytics."
}
```

Response shape:
```json
{
  "requirement": "...",
  "scenario": "greenfield",
  "domain": "url_shortener",
  "clarifiedProblem": "...",
  "openQuestions": ["..."],
  "tasks": [{ "step": 1, "title": "...", "aiAssist": "...", "validation": "..." }],
  "assumptions": ["..."],
  "tradeoffs": ["..."],
  "risks": ["..."]
}
```

## POST /api/assessment/report
Purpose:
- Produce a markdown engineering summary for the analyzed requirement.

Request:
```json
{
  "requirement": "Build a scalable URL shortener service with APIs, persistence, and analytics."
}
```

Response shape:
```json
{
  "analysis": { "scenario": "greenfield" },
  "reportMarkdown": "# Engineering Summary ..."
}
```

## POST /api/assessment/report/export
Purpose:
- Export the engineering summary as markdown, HTML, or PDF.

Request:
```json
{
  "requirement": "Build a scalable URL shortener service with APIs, persistence, and analytics.",
  "format": "pdf"
}
```

Response:
- markdown: text/markdown
- html: text/html
- pdf: application/pdf

## POST /api/short-urls
Purpose:
- Create a short URL mapping.

Request:
```json
{
  "originalUrl": "https://example.com/docs",
  "customCode": "docs123"
}
```

Response shape:
```json
{
  "code": "docs123",
  "originalUrl": "https://example.com/docs",
  "createdAt": "2026-07-24T00:00:00.000Z",
  "clickCount": 0,
  "lastClickedAt": null,
  "shortUrl": "/s/docs123"
}
```

Validation and policy notes:
- rejects localhost/private network URLs
- optional allowlist/blocklist policy
- subject to rate limiting

## GET /api/short-urls
Purpose:
- List created short URLs.

Response shape:
```json
{
  "items": []
}
```

## GET /api/short-urls/:code
Purpose:
- Retrieve one short URL record.

## GET /s/:code
Purpose:
- Resolve a short code, increment analytics, and redirect.

## GET /api/analytics/summary?sinceHours=24
Purpose:
- Return total clicks and unique links within a time window.

Response shape:
```json
{
  "sinceHours": 24,
  "totalClicks": 3,
  "uniqueLinks": 2,
  "generatedAt": "2026-07-24T00:00:00.000Z"
}
```

## GET /api/analytics/top-links?sinceHours=24&limit=10
Purpose:
- Return top links by click volume within a time window.

Response shape:
```json
{
  "sinceHours": 24,
  "limit": 10,
  "items": [
    {
      "code": "top1",
      "originalUrl": "https://example.com/popular",
      "clickCount": 2,
      "lastClickedAt": "2026-07-24T00:00:00.000Z"
    }
  ]
}
```

## Optional Reviewer API Key Mode
When REVIEWER_API_KEY is configured:
- all /api routes require the x-api-key header
- missing or incorrect API key returns 401 Unauthorized
