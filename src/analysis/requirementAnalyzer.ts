export type ScenarioType = "greenfield" | "brownfield" | "ambiguous";

export interface EngineeringTask {
  step: number;
  title: string;
  aiAssist: string;
  validation: string;
}

export interface AnalysisResult {
  requirement: string;
  scenario: ScenarioType;
  domain: "url_shortener" | "general_engineering";
  clarifiedProblem: string;
  openQuestions: string[];
  tasks: EngineeringTask[];
  assumptions: string[];
  tradeoffs: string[];
  risks: string[];
}

export function analyzeRequirement(requirement: string): AnalysisResult {
  const normalized = requirement.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();

  let scenario: ScenarioType = "greenfield";
  if (["existing", "refactor", "without changing", "bug fix", "legacy", "enhance"].some((k) => lower.includes(k))) {
    scenario = "brownfield";
  }

  if (["better", "improve", "somehow", "maybe", "faster", "good"].some((k) => lower.includes(k))) {
    scenario = "ambiguous";
  }

  const isUrlShortener = ["url shortener", "short link", "redirect", "analytics"].some((k) => lower.includes(k));
  const domain = isUrlShortener ? "url_shortener" : "general_engineering";

  const tasks: EngineeringTask[] = [
    {
      step: 1,
      title: "Clarify requirement intent",
      aiAssist: "Use AI to draft interpretation and missing constraints.",
      validation: "Engineer confirms interpretation and constraints."
    },
    {
      step: 2,
      title: "Decompose into implementation tasks",
      aiAssist: "Use AI to propose ordering and dependencies.",
      validation: "Engineer finalizes sequence and scope boundaries."
    }
  ];

  if (isUrlShortener) {
    tasks.push(
      {
        step: 3,
        title: "Build URL persistence and redirect flow",
        aiAssist: "Use AI to draft endpoint and model skeletons.",
        validation: "Engineer verifies correctness and edge cases with tests."
      },
      {
        step: 4,
        title: "Add analytics and validation checks",
        aiAssist: "Use AI to draft analytics schema and tests.",
        validation: "Engineer verifies API contracts and data integrity."
      }
    );
  }

  tasks.push({
    step: tasks.length + 1,
    title: "Run quality checks",
    aiAssist: "Use AI to draft missing tests and docs.",
    validation: "Engineer reviews all outputs before acceptance."
  });

  const openQuestions = isUrlShortener
    ? [
        "Should custom aliases be allowed?",
        "What is the retention policy for click analytics?",
        "Do short links need expiration support?"
      ]
    : ["What are the acceptance criteria?", "Who are the consumers of this feature?"];

  const assumptions = isUrlShortener
    ? [
        "Short code uniqueness is required.",
        "Redirect should be deterministic and preserve target URL.",
        "Analytics can begin with per-click tracking and aggregate count."
      ]
    : ["Requirement scope will be clarified before implementation."];

  const tradeoffs = [
    "Fast delivery versus full production hardening.",
    "AI-assisted drafting speed versus manual validation rigor."
  ];

  const clarifiedProblem = isUrlShortener
    ? "Build a URL shortener service with APIs, persistence, analytics, and safe redirects."
    : "Transform requirement into testable engineering outcomes with explicit assumptions.";

  const risks = [
    "AI draft may miss edge cases without engineer review.",
    "Ambiguous inputs can lead to incorrect assumptions.",
    ...(isUrlShortener ? ["Redirect abuse and code collision need safeguards."] : [])
  ];

  return {
    requirement: normalized,
    scenario,
    domain,
    clarifiedProblem,
    openQuestions,
    tasks,
    assumptions,
    tradeoffs,
    risks
  };
}

export function generateEngineeringReport(requirement: string, analysis: AnalysisResult): string {
  const lines: string[] = [];

  lines.push("# Engineering Summary");
  lines.push("");
  lines.push("## Requirement");
  lines.push(requirement);
  lines.push("");
  lines.push("## Classification");
  lines.push(`- Scenario: ${analysis.scenario}`);
  lines.push(`- Domain: ${analysis.domain}`);
  lines.push("");
  lines.push("## Clarified Problem");
  lines.push(analysis.clarifiedProblem);
  lines.push("");
  lines.push("## Task Decomposition");
  for (const task of analysis.tasks) {
    lines.push(`- Step ${task.step}: ${task.title}`);
    lines.push(`  - AI Assist: ${task.aiAssist}`);
    lines.push(`  - Validation: ${task.validation}`);
  }
  lines.push("");
  lines.push("## Open Questions");
  for (const item of analysis.openQuestions) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("## Assumptions");
  for (const item of analysis.assumptions) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("## Risks and Trade-offs");
  for (const item of analysis.risks) {
    lines.push(`- Risk: ${item}`);
  }
  for (const item of analysis.tradeoffs) {
    lines.push(`- Trade-off: ${item}`);
  }

  return lines.join("\n");
}
