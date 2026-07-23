# Architecture Overview

## Goal
Provide a standalone assessment project that demonstrates engineer-led AI-assisted software delivery with a mandatory URL shortener use case.

## Components
- Requirement Analysis Module: classifies requirement scenario and produces engineering task breakdown.
- URL Shortener Module: creates short codes, resolves redirects, and tracks clicks.
- API Layer: exposes analysis and shortener endpoints.
- Web Demo UI: quick way to run flows manually.
- Test Suite: validates behavior and protects regressions.

## Design Decisions
- Keep implementation intentionally lightweight for interview turnaround.
- Ensure deterministic tests and no external AI service dependency for baseline reliability.
- Keep APIs simple and easy to replace with persistent storage in a follow-up iteration.
