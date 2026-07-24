# Example Scenarios

## 1. Greenfield Requirement
Input:

"Build a scalable URL shortener service with APIs, persistence, and analytics."

Expected structured outcome:
- Scenario: greenfield
- Domain: url_shortener
- Clarified problem: build a URL shortener with APIs, persistence, analytics, and safe redirects
- Task breakdown:
  1. clarify intent and constraints
  2. decompose implementation tasks
  3. build persistence and redirect flow
  4. add analytics and validation checks
  5. run quality checks

AI-assisted execution:
- AI drafts decomposition and reporting structure.
- Engineer implements the actual API, storage, redirects, tests, and documentation.

Validation:
- npm run migrate
- npm run lint
- npm run build
- npm test

## 2. Brownfield Requirement
Input:

"Enhance existing short link service without changing redirect behavior."

Expected structured outcome:
- Scenario: brownfield
- Focus: preserve existing redirect semantics while introducing additive change
- Task breakdown includes backward compatibility and regression review

AI-assisted execution:
- AI suggests a low-risk enhancement framing and regression focus.
- Engineer confirms compatibility boundaries and validates with tests.

Validation:
- verify redirect behavior remains unchanged
- verify analytics and read paths still succeed
- re-run full test suite

## 3. Ambiguous Requirement
Input:

"Maybe improve the short links experience somehow."

Expected structured outcome:
- Scenario: ambiguous
- Output should highlight lack of measurable criteria and push toward clarification
- Open questions should be surfaced before implementation starts

AI-assisted execution:
- AI drafts open questions and potential interpretations.
- Engineer selects what is actionable and refuses hidden assumptions.

Validation:
- confirm clarified problem statement exists
- confirm open questions are explicit
- avoid implementation that depends on unstated goals

## How to Demonstrate During Review
1. Call POST /api/assessment/analyze with each scenario.
2. Show differences in scenario classification and task structure.
3. Generate POST /api/assessment/report output for the greenfield case.
4. Export the report through POST /api/assessment/report/export.
