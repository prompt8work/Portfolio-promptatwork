---
name: publish-handbook
description: Publish a generated student handbook to promptatwork.com as a pipeline - checks the topic is unique (or makes it a new version), uploads the PDF, notebook and primer, writes the course page on /training and a blog post, then verifies and publishes. Use right after a handbook is generated, or when asked to put a handbook, course or its update on the website.
---

# Publish a handbook to promptatwork.com

One topic = one course on `/training/<slug>` plus one blog post per version. A handbook on a topic the site already has becomes a **new version** of that course, never a second course. The topic-uniqueness hook (`.claude/hooks/check-topic-unique.mjs`, wired in `.claude/settings.json`) refuses any Sanity write that breaks this; the agents also run its `--validate` mode themselves, so the rules hold even in a session where the hook is not loaded.

## Inputs to collect first

- The generated **handbook PDF** (required), and if they exist the **Colab notebook** (.ipynb), the **visual primer** PDF and any other learner files.
- **Course title** and a proposed **topicKey** (the subject in kebab-case: `mcp-server`, `production-rag`).
- A **summary** of the handbook, read from it: audience, duration and session timetable, chapters or labs, tools, what is free.
- Niharika's **headshot** for the cover (from the project files; never commit it to this repo, which is public).
- Whether the user wants it **live** (default) or **draft only**, and for an update whether the change is **major** (default, `1.0` -> `2.0`) or **minor** (`1.0` -> `1.1`).

Do not stop to ask for what can be read from the handbook itself.

## Run folder

Create `.claude/pipeline/runs/<topicKey>-<YYYYMMDD-HHmm>/manifest.json`:

```json
{
  "createdAt": "<now>",
  "mode": "live | draftOnly",
  "change": "major | minor",
  "topic": { "title": "...", "topicKey": "..." },
  "inputs": { "handbookPdf": "...", "notebook": null, "primerPdf": null, "extraFiles": [], "photo": "...",
              "coverSubtitle": "...", "coverChips": ["..."], "summary": { "audience": "...", "duration": "...", "labs": ["..."], "modules": ["..."], "tools": ["..."], "free": ["..."] } }
}
```

Each agent reads this file and adds its own section. The folder is git-ignored.

## The pipeline

Run the agents one after another, waiting for each. Give every agent the run folder path. If an agent type is not available in this session, start a general-purpose agent and give it the content of `.claude/agents/<name>.md` as its instructions.

| Step | Agent | Does | Stops the run when |
| --- | --- | --- | --- |
| 1 | `handbook-topic-scout` | Refreshes `.claude/pipeline/topic-index.json`; verdict NEW, UPDATE or REVIEW | the handbook PDF is missing |
| 2 | (you) | REVIEW only: show the user the matches and ask "new version of X, or a different topic?". With nobody to ask: treat similarity >= 0.8 as UPDATE, otherwise stop and report | the user does not answer and similarity < 0.8 |
| 3 | `handbook-asset-publisher` | Uploads files and cover, records asset refs | upload fails twice |
| 4 | `handbook-blog-writer` | Draft blog post (new, or vN linked to the previous post) | `--validate` keeps failing |
| 5 | `handbook-course-writer` | Draft course: created (NEW) or patched with version bump, changelog and archived downloads (UPDATE) | `--validate` says the topic exists on a NEW verdict: restart from step 1 |
| 6 | `handbook-publish-verifier` | Checks drafts, publishes post then course, re-checks, writes `report.md` | any check fails (nothing is published) |

A REVIEW the user settles as "different topic": add `{"topicKey": "<new key>", "notDuplicateOf": "<matched id>", "reason": "<their words>"}` to `.claude/pipeline/topic-acks.json` (this file is committed, so the decision is kept), then continue with verdict NEW.

## Finish

Tell the user in a few lines: NEW or new version (with the version), the course URL, the blog URL, for an update the older post that now links forward, and anything skipped. Send `report.md` only if they ask. The site picks up published content within about a minute.

## Rules

- Never change an existing slug or topicKey; links are shared on LinkedIn.
- Never edit or unpublish an older version's post. The site links old and new posts both ways from `previousVersion`.
- Never put Prompt at Work branding inside the handbook files themselves.
- If any step fails, nothing after it runs. Drafts already written stay as drafts; say which ones.
