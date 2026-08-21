# How to author Rooks documentation

This guide explains where documentation lives, the hook-page contract, how examples are checked, and how to validate the site.

## Use the active source only

All hand-authored website content lives under:

```text
apps/website/content/docs
```

Do not create a second registry or edit retired copies of hook Markdown. The package export map and the `index.ts`, `experimental.ts`, and `temporal.ts` barrels define the public API. A shared in-memory manifest joins those exports to MDX metadata for the website, README generation, scaffolding, and validation.

## Create one page per canonical hook

Place a hook page at:

```text
apps/website/content/docs/hooks/(category)/useName.mdx
```

The route group supplies the category without changing the public URL. Filename and title must match the canonical public symbol.

- A supported alias is listed on the canonical page; it does not get a duplicate page.
- An internal helper does not get a public page.
- `related` entries point to canonical public hooks.

## Add the required frontmatter

Every hook page uses these fields:

```yaml
---
title: useCounter
description: Manages a numeric counter with increment, decrement, and reset operations.
entrypoint: rooks
status: stable
aliases: []
related: [useToggle]
---
```

Rules:

- `entrypoint` is exactly `rooks`, `rooks/experimental`, or `rooks/temporal`.
- `status` is exactly `stable`, `experimental`, or `deprecated`.
- `aliases` exactly matches aliases declared by the relevant barrel.
- `related` contains only canonical public hook names.
- Category comes from the route-group directory. Do not repeat it in frontmatter.
- Do not add the old `id` or `sidebar_label` fields.

The site renders the import path, exact TypeScript signature, status warning, and aliases from the manifest. Do not maintain a second manual copy of those facts in the page body.

## Write the required sections

Use this order so readers can scan any hook page consistently:

1. `## About`: intended use and the problem the hook solves.
2. `## Example` or `## Examples`: at least one self-contained TSX component with visible output.
3. `## Parameters`: exact types, defaults, constraints, and no-parameter behavior.
4. `## Return value`: every field and callback, or an explicit statement that the hook returns `void`.
5. `## Behavior and lifecycle`: updates, cleanup, concurrency, and error semantics derived from source and tests.
6. `## Compatibility and accessibility`: browser support, permissions, server rendering, hydration, and accessibility notes. State that no special considerations apply when that is the accurate result.
7. `## Related`: links to related hooks and guides.

Do not add a duplicate H1; the page title comes from frontmatter.

## Write executable examples

The first-party `ts` and `tsx` fences are typechecked against the workspace package.

- Import from the page's real entrypoint.
- Use only public values and explicitly exported public types.
- Keep the primary example self-contained and render visible output. A component that only returns `null` is not a primary example.
- Include every React import and local type the example needs.
- Show unsupported-browser or permission fallbacks when they are normal runtime states.
- Keep examples static. Do not add Sandpack or code that loads npm `latest` at runtime.
- Mark pseudocode, partial signatures, and non-runnable excerpts as `text`, not `ts` or `tsx`.

Internal option/result types may be described as inline object shapes. Never tell users to import a type unless it is explicitly exported from the package entrypoint.

## Link routes safely

Use site-root paths for website links, for example:

```markdown
[Server rendering and browser APIs](/docs/guides/ssr-and-browser-apis)
```

Link hook pages at `/docs/hooks/useName`. The validation command checks local routes deterministically on every pull request. External sites are checked separately so a third-party outage does not make pull request CI flaky.

## Preview and validate

Start the local site:

```bash
pnpm docs:dev
```

When export or metadata changes affect the generated README hook zone, refresh it:

```bash
pnpm docs:generate
pnpm docs:generate --check
```

Run the complete documentation contract:

```bash
pnpm docs:check
```

Use `pnpm docs:build` when you only need the production Content Collections and Next.js build. `docs:check` includes that build after its source validations.

Before review, also run:

```bash
pnpm all-checks
```

`docs:check` reports the source file and public symbol for schema, API parity, import, snippet, required-section, link, formatting, or stale-generation failures.

## Review the reader journeys

After automated checks pass, verify desktop and mobile behavior manually:

- the Getting Started, Guides, Hooks, Reference, and Explanation navigation order;
- collapsed hook categories;
- global search for canonical names and aliases;
- alias redirects;
- copyable examples;
- links to contributing, support, security, changelog, GitHub, and npm.

## Related guides

- [Contributing](../CONTRIBUTING.md)
- [Local development](./local-development.md)
- [Adding or changing a hook](./adding-a-hook.md)
- [Code style](../code-style-guide.md)
