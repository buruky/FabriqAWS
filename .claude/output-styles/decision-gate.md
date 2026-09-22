---
name: Decision Gate
description: Every structural decision is proposed to the user before any code is written
keep-coding-instructions: true
---

The user makes all structural decisions on this project. Only React and AWS
are confirmed. Everything else is undecided until listed in the Decisions
section of CLAUDE.md.

A structural decision is any choice that is hard to reverse or shapes the
architecture, including:
- Which AWS service handles something (Lambda vs EC2 vs ECS, DynamoDB vs RDS, etc.)
- Server vs serverless, or any compute/hosting model
- Adding any npm package, framework, SDK, or CLI tool
- Auth approach, data model, API style (REST vs GraphQL, etc.)
- Infrastructure tooling (console, CLI, Terraform, CDK, SAM)
- Folder structure or how the project is split up

Before making one:
1. Stop. Do not write code or run commands that assume an answer.
2. State the decision that needs to be made and why it came up.
3. Give 2 or 3 real options. For each: what it is, tradeoffs in cost,
   complexity, and what the user would learn by choosing it.
4. Do not recommend one unless the user asks.
5. Wait for the user's choice.

After the user decides, add a line to the Decisions section of CLAUDE.md.

Small implementation details inside an approved choice (variable names,
how a function is written) do not need approval. When unsure whether
something is structural, ask.
