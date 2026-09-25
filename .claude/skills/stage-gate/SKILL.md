---
name: stage-gate
description: Entry and exit checks for each build stage of the wardrobe app (Stage 0 local React through Stage 11+ IaC and CI). Use whenever the developer starts, finishes, or asks about a stage, says "gate", "am I ready for stage N", "is this stage done", "what's next", or is about to stack a new layer (hosting, CDN, IAM, API, database, auth, IaC) on top of an existing one. Also use before wiring React to any backend piece that has not been verified alone.
---

# Stage Gate

The app is built in isolated stages. Each layer must be proven on its own with the most primitive tool before the next is stacked on top, because a bug found in one layer is cheap and a bug found across four layers is not. This skill is the checkpoint between stages.

Before running a gate, read `CLAUDE.md` and `docs/stages.md` (create the latter from the template below if missing) to learn which decisions have been made. The stage list in `references/stages.md` is a rough plan: if a stage depends on a choice that has not been recorded (server vs serverless, which database, which auth, which IaC tool), do not assume one. Stop and present options with tradeoffs, and let the developer decide.

## Two modes

Figure out which one applies from context. If unclear, ask.

### Entry gate (starting a stage)

Produce this, and nothing else until the developer agrees to it:

```
## Stage N entry: <name>
Goal: <one sentence, what exists at the end that doesn't now>
Prerequisites: <exit criteria from earlier stages this depends on, each marked verified or not>
Decisions needed: <open choices this stage forces, with options, or "none">
Primitive test: <the lowest level tool that proves it works, e.g. curl, console, CLI>
Exit criteria:
  - [ ] <observable, checkable fact>
  - [ ] ...
Cost exposure: <free tier / small / bills while idle, and what to watch>
Out of scope: <things deliberately left for later stages>
```

If any prerequisite is not verified, say so plainly and recommend going back. Do not let an unverified layer be built on.

Exit criteria must be observable: a command and its expected output, a status code, a page that loads on a phone. "Works" or "set up correctly" is not a criterion.

### Exit gate (finishing a stage)

1. Go through each exit criterion. For each one, either run the check (read-only commands are fine) or give the developer the exact command and expected result and ask for the output. Do not mark a criterion passed on assumption.
2. Report:

```
## Stage N exit: <name>
  - [x] <criterion>: <evidence, e.g. "curl returned 200, x-cache: Hit from cloudfront">
  - [ ] <criterion>: <what failed and the likely layer at fault>
Result: PASS / FAIL
Left running: <resources still up and whether they cost anything>
Teardown: <commands or console steps if the developer wants to tear down>
Explain it back: <2 or 3 questions the developer should be able to answer in an interview about this stage>
```

3. On PASS, update `docs/stages.md`: mark the stage done, the date, and any decisions made during it. On FAIL, do not move on; help debug the failing criterion, starting from the outermost layer.

## Rules

- Never start the next stage's work during an exit gate.
- A stage can pass with known limitations only if the developer explicitly accepts them; record them in `docs/stages.md`.
- Keep the report tight. No filler.

## docs/stages.md template

```
# Stages

| Stage | Status | Date | Notes |
|---|---|---|---|
| 0 Local React + mock data | not started | | |
| 1 S3 static hosting | not started | | |
| 2 CloudFront | not started | | |
| 3 IAM sandbox | not started | | |
| 4 Compute decision | not started | | |
| 5 Hello world API | not started | | |
| 6 Frontend fetches API | not started | | |
| 7 Database | not started | | |
| 8 Auth standalone | not started | | |
| 9 Auth on API | not started | | |
| 10 Login UI end to end | not started | | |
| 11+ IaC, CI, monitoring | not started | | |

## Decisions
<!-- one line per decision: stage, choice, options considered -->

## Accepted limitations
```

For the per-stage default tests and exit criteria, read `references/stages.md`.
