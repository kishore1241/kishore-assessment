import PDFDocument from "pdfkit";
import { AnalysisResult } from "./requirementAnalyzer.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function renderReportHtml(requirement: string, analysis: AnalysisResult): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Engineering Summary</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; color: #0f172a; }
    h1, h2 { margin-bottom: 0.4rem; }
    .muted { color: #475569; }
    .card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Engineering Summary</h1>
  <p class="muted">Generated for AI-assisted assessment submission</p>
  <div class="card">
    <h2>Requirement</h2>
    <p>${escapeHtml(requirement)}</p>
  </div>
  <div class="card">
    <h2>Classification</h2>
    <p>Scenario: ${escapeHtml(analysis.scenario)}</p>
    <p>Domain: ${escapeHtml(analysis.domain)}</p>
  </div>
  <div class="card">
    <h2>Clarified Problem</h2>
    <p>${escapeHtml(analysis.clarifiedProblem)}</p>
  </div>
  <div class="card">
    <h2>Task Decomposition</h2>
    ${renderList(analysis.tasks.map((task) => `Step ${task.step}: ${task.title} | AI Assist: ${task.aiAssist} | Validation: ${task.validation}`))}
  </div>
  <div class="card">
    <h2>Open Questions</h2>
    ${renderList(analysis.openQuestions)}
  </div>
  <div class="card">
    <h2>Assumptions</h2>
    ${renderList(analysis.assumptions)}
  </div>
  <div class="card">
    <h2>Risks</h2>
    ${renderList(analysis.risks)}
  </div>
  <div class="card">
    <h2>Trade-offs</h2>
    ${renderList(analysis.tradeoffs)}
  </div>
</body>
</html>`;
}

export async function generateReportPdfBuffer(markdown: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", (error: Error) => {
      reject(error);
    });

    doc.fontSize(18).text("Engineering Summary", { underline: true });
    doc.moveDown();
    doc.fontSize(11);

    for (const line of markdown.split("\n")) {
      doc.text(line);
    }

    doc.end();
  });
}