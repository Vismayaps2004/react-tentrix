---
name: claude-md
description: Create CLAUDE.md if it does not exist, or update the Recent Changes section if it does. Commit the update separately from the feature commit.
next: null
---

# Step 5 — Update CLAUDE.md

After committing the feature, check for `CLAUDE.md` in the project root.

## If CLAUDE.md does NOT exist — create it

```markdown
# CLAUDE.md

This file helps Claude understand the project structure and conventions.

## Project Overview
<Short description of what this project does>

## Tech Stack
<Languages, frameworks, key libraries>

## Project Structure
<Brief directory overview>

## Conventions
<Code style, naming patterns, important rules>

## Recent Changes
- <YYYY-MM-DD>: <what was changed and why>
```

## If CLAUDE.md already exists — update it

- Add an entry under `## Recent Changes` (or create the section if missing)
- Update any section that is now outdated (e.g. new dependencies, new directories)
- Do **not** remove existing content unless it is clearly wrong

## Commit the update

```
docs: update CLAUDE.md with recent changes
```

This must be a **separate commit** from the feature commit.

---

✅ Workflow complete.