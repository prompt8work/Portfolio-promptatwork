// Homepage content per PRD §14-19. Kept separate from the legacy data/
// files (personalInfo, resume data, etc.) which still feed the Resume and
// Cover Letter pages unchanged. This becomes a Sanity-driven content type
// in Phase 2 — shaped with that migration in mind.

// Positioning from Niharika's portfolio copy (October 2026): AI Enablement
// Officer and founder of Prompt at Work, with the two portfolio profiles
// (/portfolio) carrying the detail. Still no global numeric claims — the
// numbers are being added back deliberately, later.
export const hero = {
  eyebrow: "AI ENABLEMENT OFFICER · FOUNDER, PROMPT AT WORK",
  // Rotates inside the hero pill, first entry is what the server renders.
  roles: ["AI ENABLEMENT OFFICER", "AI SOLUTIONS ENGINEER", "CORPORATE TRAINER", "FOUNDER, PROMPT AT WORK"],
  // The page's H1: name, every role and the city in plain server-rendered
  // text, since the rotating pill only renders its first role on the
  // server (Docs/development-plan/13-seo-aeo.md).
  identity: "Niharika Dhande — AI Enablement Officer, AI Solutions Engineer, Prompt Engineer & Corporate AI Trainer in Indore, India",
  heading: "I help teams turn AI tools into everyday results.",
  description:
    "I'm Niharika Dhande. I sit between technology, product and people: I find where AI fits in a team's workflow, build the solution, and train the people who will use it.",
  ctaPrimary: { label: "Work with me", href: "/contact" },
  ctaSecondary: { label: "See my work", href: "/portfolio" },
  ctaTertiary: { label: "Explore the AI Lab", href: "/ai-lab" },
};

