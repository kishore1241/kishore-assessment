# AI Usage Evidence

## Objective
This project is intentionally framed as engineer-led AI-assisted software development. AI is used as an accelerator for decomposition, drafting, and review prompts, while the engineer owns acceptance criteria, implementation decisions, validation, and final outputs.

## Where AI Assistance Shows Up in the Prototype
- Requirement interpretation and decomposition:
  - src/analysis/requirementAnalyzer.ts
- Engineering summary generation:
  - POST /api/assessment/report
- Exportable report generation:
  - POST /api/assessment/report/export

## Representative Prompt Patterns
### 1. Requirement Understanding
Example prompt shape:

"Interpret this requirement as a senior engineer, identify ambiguities, propose a clarified problem statement, and outline a sequence of engineering tasks with validation steps. Requirement: Build a scalable URL shortener service with APIs, persistence, and analytics."

Expected AI contribution:
- first-pass interpretation
- ambiguity detection
- candidate task breakdown

Engineer responsibilities:
- confirm scope boundaries
- reject missing/unsafe assumptions
- approve final task structure

### 2. Brownfield Analysis
Example prompt shape:

"Review this existing feature request and propose a low-risk enhancement plan that preserves backward compatibility. Requirement: Enhance existing short link service without changing redirect behavior."

Expected AI contribution:
- candidate change points
- regression-test ideas
- compatibility considerations

Engineer responsibilities:
- define compatibility boundaries
- validate no existing behavior regresses

### 3. Documentation and Validation Support
Example prompt shape:

"Draft a concise engineering summary with risks, trade-offs, and validation steps for this implementation."

Expected AI contribution:
- initial report structure
- draft narrative wording

Engineer responsibilities:
- verify technical correctness
- ensure claims match implementation and tests

## Accepted vs Rejected AI Behavior
### Accepted patterns
- Suggesting task decomposition
- Drafting documentation structure
- Proposing test cases and edge cases
- Reformatting output into reviewable engineering artifacts

### Rejected patterns
- Treating AI output as authoritative without tests
- Allowing AI to silently fill critical product assumptions
- Accepting design changes without explicit validation
- Replacing engineering review with generation-only workflow

## Validation Discipline
All AI-assisted artifacts are accepted only after:
1. Endpoint behavior is manually or automatically verified.
2. Lint/build/test pass.
3. Security and failure cases are reviewed.
4. Documentation matches actual implementation.

## Why This Matters for the Assessment
The assessment emphasizes: AI assists the engineer within tasks; the engineer owns execution and quality.

This repository aligns with that principle by:
- making decomposition/reporting explicit
- requiring validation gates
- separating runtime behavior from explanatory AI-derived outputs
- documenting risks and trade-offs rather than hiding them
