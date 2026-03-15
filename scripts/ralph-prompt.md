# Ralph Agent Instructions — rooks monorepo

You are an autonomous coding agent working on the **rooks** monorepo (a React hooks library).

## Project Context

- **Monorepo**: pnpm workspaces with Turbo
- **Packages**: `packages/rooks` (main library), `apps/website` (Next.js docs site), `packages/eslint-config`, `packages/typescript-config`
- **Build**: `pnpm build` (Turbo orchestrated)
- **Tests**: `pnpm test` (Vitest)
- **Typecheck**: `pnpm typecheck`
- **Lint**: `pnpm lint`
- **All checks**: `pnpm all-checks` (runs coverage, typecheck, lint, sanity-check)
- **Docs build**: `cd apps/website && pnpm build` (content-collections + Next.js)
- **Node version**: 22.14.0
- **Package manager**: pnpm 10.6.4

## Your Task

1. Read `.ralph/stories.json` in the project root
2. Read `.ralph/learnings.txt` — check the **Codebase Patterns** and **Gotchas** sections FIRST for learnings from previous iterations
3. Read `.ralph/progress.txt` to see what was done in prior iterations
4. Pick the **highest priority** story where `passes: false`
5. Implement that single story completely
6. Run quality checks:
   - For rooks package changes: `cd packages/rooks && pnpm test && pnpm typecheck && pnpm lint`
   - For website changes: `cd apps/website && pnpm build`
   - For all changes: `pnpm all-checks` from root
7. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
8. Update `.ralph/stories.json` to set `passes: true` for the completed story
9. Append your progress to `.ralph/progress.txt` (see format below)
10. If you discovered patterns or gotchas, add them to `.ralph/learnings.txt`
11. Check stop condition and output the appropriate signal

## Progress Report Format

APPEND to `.ralph/progress.txt` (never replace existing content):

```
## [Date] - [Story ID]: [Title]
- What was implemented
- Files changed
---
```

## Recording Learnings

If you discover a **reusable pattern** or **gotcha** that future iterations should know, add it to `.ralph/learnings.txt`:

- Add general patterns to the `## Codebase Patterns` section
- Add project-specific warnings to the `## Gotchas` section

Only add learnings that are **general and reusable**, not story-specific details.

## Quality Requirements

- ALL commits must pass the project's quality checks (tests, typecheck, lint, build)
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns in the codebase
- The docs/website build (`apps/website`) MUST also pass

## Stop Condition

After completing a story, check if ALL stories have `passes: true`.

**If ALL stories are complete:**
```
<promise>COMPLETE</promise>
```

**If there are still stories with `passes: false`:**
End your response normally. The next iteration will pick up the next story.

## Critical Rules

- Work on ONE story per iteration — do not attempt multiple stories
- You have no memory of previous iterations — rely on git history, `.ralph/progress.txt`, and `.ralph/learnings.txt`
- If a story is too large to complete, update `.ralph/stories.json` to split it into smaller stories, commit that change, and exit
- Test before marking done — only set `passes: true` if tests actually pass
- Commit frequently with clear messages
- When upgrading packages, use `pnpm update --latest` or edit package.json directly then `pnpm install`
- If a package upgrade causes breaking changes, fix the code to work with the new version
- Always ensure `pnpm install` runs cleanly with no peer dependency errors
