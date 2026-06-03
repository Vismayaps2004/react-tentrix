---
name: plan
description: Break the feature into an ordered task list and wait for explicit user approval before writing any code.
next: steps/03-execute.md
---

# Step 2 — Plan Before Executing

Break the feature into a concrete task list **before writing any code**.

## Task breakdown format

```
## Plan: <Feature Name>

### Tasks
1. [ ] <Task description> — <file or module affected>
2. [ ] <Task description> — <file or module affected>
...

### Notes
- Any design decisions, tradeoffs, or things to watch out for
```

## Rules

- Each task must be atomic (one concern, one area of code)
- List tasks in dependency order (what must happen first)
- Mention which files will be created or modified for each task
- Flag any task that has uncertainty or risk

## Approval

**Wait for explicit approval** before proceeding to execution.

- User says "looks good", "go ahead", "approved", or similar → proceed
- User suggests changes → update the plan and ask for approval again