---
name: decision-record
description: Present options and record architecture decisions (ADRs) for the wardrobe app. Use whenever a structural choice comes up, in frontend or backend: server vs serverless, which database, which auth provider, Terraform vs CDK, CI setup, token storage, state management, API shape, hosting, caching strategy, or any choice that would be expensive to reverse. Also use when the developer says "decide", "which should I use", "options for", "ADR", "log this decision", "why did we pick X", or wants to backfill decisions already made. Use it even if the choice seems obvious, because the developer makes every structural call themselves.
---

# Decision Record

The developer makes every structural decision on this project and wants a log of them they can talk through in interviews. This skill has two jobs: present the choice well, then record it well. Never skip straight to recording, and never implement a structural choice before it is recorded.

## Is this a structural decision?

Record it if it is hard or costly to reverse, shapes later stages, or is something an interviewer might ask "why did you choose that?" about. Examples: compute model, database, data model for clothes and outfits, auth provider, IaC tool, CI auth method, token storage, CDN origin setup.

Do not record small implementation details inside an already-made decision (a variable name, a Tailwind class, a timeout value). Just handle those and mention what you picked.

If unsure, ask: "Worth an ADR, or just pick one?"

## Step 1: Present the options

Read `CLAUDE.md`, `docs/stages.md`, and existing ADRs in `docs/decisions/` first, so options respect decisions already made. Then present 2 to 4 real options, in this format:

```
## Decision: <question being decided>
Why it matters now: <what this blocks or shapes, one or two lines>
Constraints: <things already decided or required, e.g. mobile performance, free tier, React + Vite frontend>

### Option A: <name>
What it is: <one line, no jargon left unexplained>
Cost: <at this project's scale, including idle cost and free tier>
Complexity: <setup and ongoing work, what can go wrong>
Learning value: <what building it teaches>
Resume signal: <how it reads to a new grad SWE recruiter or interviewer>

### Option B: ...

Lean: <which one Claude would lean toward and why, in 1 to 2 lines, or "no strong lean">
Question for you: <anything only the developer can answer that would change the pick>
```

Guidance:
- Options must be genuinely viable. Do not pad with a strawman.
- Be concrete about cost with real pricing shape (per request, per hour, idle) rather than "cheap".
- Name the tradeoff each option forces, not only its benefits.
- If the answer depends on something not yet known (e.g. access patterns for the database), say so and suggest settling that first.
- Then stop and wait. The developer picks.

## Step 2: Record the decision

Once the developer chooses, write an ADR using `references/template.md`.

- File: `docs/decisions/NNNN-short-kebab-title.md`, numbered in order starting at 0001.
- Capture the developer's reasoning in their own words where they gave it. If they chose against Claude's lean, record their reasons fairly; do not editorialize.
- Keep it to about a page. Tight language, no filler.
- Add one line to the Decisions section of `docs/stages.md`: `- Stage N: <choice> (see decisions/NNNN-title.md)`.
- If `CLAUDE.md` has a decisions list, add the choice there too, one line.

## Changing a decision later

Never edit an accepted ADR's decision. Write a new ADR that supersedes it, and change the old one's status to `Superseded by NNNN`. The history of changing your mind is itself a good interview story.

## Backfill mode

If asked to backfill, read `CLAUDE.md` for decisions already made (e.g. React + TypeScript + Vite, Tailwind CSS 3, React Router 7, fonts) and ask the developer, one decision at a time, what alternatives they considered and why they chose this. Write each as an ADR with status `Accepted (backfilled)`. Do not invent reasons they did not give; leave a field as "not recorded" instead.

## Interview prep

When asked "prep me on my decisions" or similar, read all ADRs and quiz the developer: ask why they chose X over Y, what would make them switch, and what went wrong. Give feedback on whether their answer was specific and mentioned a real tradeoff.
