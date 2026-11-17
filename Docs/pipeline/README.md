# Handbook → website pipeline

Every student handbook ends up on promptatwork.com the same way: a course on `/training/<slug>` with free downloads, and a blog post about it. A handbook on a topic the site already has becomes a new version of that course, never a duplicate.

## How it fits together

```
generate handbook (student-handout skill, in the Student Handouts project)
        │  handbook PDF · Colab notebook · visual primer
        ▼
/publish-handbook  (.claude/skills/publish-handbook/SKILL.md)
  1 handbook-topic-scout       NEW / UPDATE / REVIEW, refreshes the topic index
  2 you                        REVIEW only: "new version of X, or a different topic?"
  3 handbook-asset-publisher   uploads files + renders the cover
  4 handbook-blog-writer       draft post (v1, or vN linked to the previous post)
  5 handbook-course-writer     draft course: created, or patched with a version bump
  6 handbook-publish-verifier  checks, publishes post then course, writes report.md
        │
        ▼
promptatwork.com/training/<slug>   ·   promptatwork.com/blog/<slug>
```

Every Sanity create or patch passes `.claude/hooks/check-topic-unique.mjs` (a PreToolUse hook in `.claude/settings.json`). It refuses:

| Situation | What it says to do instead |
| --- | --- |
| A second course with the same topicKey | Patch the existing course and bump its version |
| A course or course post whose title matches another topic's | Publish as a new version of that topic, or record in `.claude/pipeline/topic-acks.json` why it is different |
| A post for a topic that has posts, without `previousVersion` pointing at the latest one, or without a higher version | Link it to the latest post and raise the version |
| A changed slug on an existing course or post | Keep the slug; links are shared on LinkedIn |
| Course content with no topicKey | Add one |
| A write when the existing topics cannot be read | Run the topic scout to refresh the index |

Tool and model reviews (no topicKey, category not "Courses") are not affected.

The agents also run the same rules themselves before writing (`--validate`), so a session where the hook is not loaded gets the same protection.

## Versions on the site

- **Course**: one document per topic. `version` is the current version; `changelog` lists every version with its date, summary and blog post. Old downloads stay listed as "(vX, archived)", at most two versions back. The course page shows a "Version history" section.
- **Blog**: one post per version, same `topicKey`. A new post's `previousVersion` points at the post before it. The new post says "Version 2.0. Updates <old post>"; the old post shows "There is a newer version of this post" with a link, automatically.

## Where it runs

- **Claude Code in this repo** (laptop or a cloud session started on this repo): the hook, the agents and the skill all load. Run `/publish-handbook` with the files.
- **The Student Handouts project chat**: ask Claude to attach `prompt8work/portfolio-promptatwork` and run its `publish-handbook` skill. The agents' own `--validate` step enforces the rules there; when the hook loads too, it checks again.

The Sanity connector must be connected (project `ck8wyssm`, dataset `production`).

## The prompt for the next handbook

Paste this in the Student Handouts project, filling the brackets:

```text
Create a student handbook on [TOPIC], then publish it to my website.

Handbook
- Audience: [e.g. 50/50 developers and managers / engineering students / non-technical staff]
- Level: [beginner to intermediate, with a few advanced topics]
- Session length: [2 hours / 1 day / 4 weeks]
- Balance: 70% hands-on, 30% theory
- Eyebrow: [e.g. AGENTIC AI SERIES | COHORT 02]
- Labs run in Google Colab with free keys only ([Groq / Gemini / none])
- Use my student-handout design and my headshot from the project files

Deliverables
1. The handbook PDF (A4)
2. A companion Colab notebook whose cells match the handbook's numbering
3. A 10-page visual primer PDF (1080x1350) for LinkedIn and non-technical readers

Then publish
- Attach the repo prompt8work/portfolio-promptatwork and run its publish-handbook skill on these files.
- Proposed topic key: [kebab-case subject, e.g. production-rag]
- If my site already has this topic, publish it as a new [major / minor] version of that course, linked to the old post. Don't create a duplicate.
- Mode: [live / draft only]
- When done, give me the course link, the blog link and a LinkedIn post for it.
```

For an update to an existing course, use the same prompt with "Update my handbook on [TOPIC]: [what changed]" in the first line. The scout finds the existing course and the pipeline publishes it as the next version.
