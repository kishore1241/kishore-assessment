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
  clarifiedProblem: string;
  openQuestions: string[];
  tasks: EngineeringTask[];
  risks: string[];
}

export function analyzeRequirement(requirement: string): AnalysisResult {
  const normalized = requirement.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();

  let scenario: ScenarioType = "greenfield";
  if (["existing", "refactor", "without changing", "bug fix"].some((k) => lower.includes(k))) {
    scenario = "brownfield";
  }
  if (["better", "improve", "somehow", "maybe"].some((k) => lower.includes(k))) {
    scenario = "ambiguous";
  }

  const isUrlShortener = ["url shortener", "short link", "redirect", "analytics"].some((k) => lower.includes(k));

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
    clarifiedProblem,
    openQuestions,
    tasks,
    risks
  };
}
