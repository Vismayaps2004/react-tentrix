---
name: commit
description: Commit completed changes using a structured git commit message with type prefix and bullet points summarising what changed.
next: steps/05-claude-md.md
---

# Step 4 — Commit Changes

After all tasks are complete (or a logical milestone is reached), commit the changes.

## Commit message format

```
<type>: <short description>

- <bullet summarising change 1>
- <bullet summarising change 2>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

## Example

```
feat: add user authentication flow

- Add LoginForm component with validation
- Integrate /api/auth endpoint
- Store token in httpOnly cookie
- Add auth guard to protected routes
```

## Rules

- Run `git add` and `git commit` automatically unless the user asked to review diffs first
- If there are unstaged or unrelated changes in the repo, **ask the user** before including them
- One commit per logical feature or milestone — do not bundle unrelated changes