// Where a diagram may appear in each content type — the section it's drawn
// right after. Shared by the Sanity schemas (the Placement dropdown) and
// scripts/check-content.ts, so the two can't drift. "top" (right after the
// header) is always allowed and is added by diagramsField().

export type Placement = { title: string; value: string };

export const diagramPlacements: Record<string, Placement[]> = {
  project: [
    { title: "After: Overview", value: "overview" },
    { title: "After: Problem", value: "problem" },
    { title: "After: Context", value: "context" },
    { title: "After: Solution", value: "solution" },
    { title: "After: My Role", value: "role" },
    { title: "After: Architecture", value: "architecture" },
    { title: "After: Workflow", value: "workflow" },
    { title: "After: Challenges", value: "challenges" },
    { title: "After: Results", value: "results" },
    { title: "After: Learnings", value: "learnings" },
    { title: "After: Future Scope", value: "futureScope" },
  ],
  tool: [
    { title: "After: Overview", value: "overview" },
    { title: "After: What It Does", value: "whatItDoes" },
    { title: "After: Why I Explored It", value: "whyExplored" },
    { title: "After: Research", value: "research" },
    { title: "After: Best Use Cases", value: "useCases" },
    { title: "After: Practical Scenarios", value: "practicalScenarios" },
    { title: "After: My Experience", value: "myExperience" },
  ],
  experiment: [
    { title: "After: Hypothesis", value: "hypothesis" },
    { title: "After: Problem", value: "problem" },
    { title: "After: Setup", value: "setup" },
    { title: "After: Prompt / Workflow", value: "promptOrWorkflow" },
    { title: "After: Input", value: "input" },
    { title: "After: Output", value: "output" },
    { title: "After: What worked / failed", value: "outcome" },
    { title: "After: Learning", value: "learning" },
    { title: "After: Decision", value: "decision" },
    { title: "After: Next Step", value: "nextStep" },
  ],
  prompt: [
    { title: "After: Prompt", value: "prompt" },
    { title: "After: Example Input", value: "exampleInput" },
    { title: "After: Example Output", value: "exampleOutput" },
    { title: "After: Expected Behavior", value: "expectedBehavior" },
    { title: "After: Failure Modes", value: "failureModes" },
  ],
  automation: [
    { title: "After: Workflow (steps)", value: "workflow" },
    { title: "After: Problem", value: "problem" },
    { title: "After: Architecture", value: "architecture" },
    { title: "After: Input", value: "input" },
    { title: "After: Output", value: "output" },
    { title: "After: Integrations", value: "integrations" },
  ],
  blog: [
    { title: "Inline — at its [[diagram:key]] line in the body", value: "inline" },
    { title: "After the opening paragraph", value: "intro" },
  ],
};
