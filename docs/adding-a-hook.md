# How to add or change a hook

This guide covers the public entrypoint decision, generator workflow, implementation contract, tests, documentation, and release note for a hook change.

## Prerequisites

- Complete [local development setup](./local-development.md).
- Read the [code style guide](../code-style-guide.md).
- For an external contribution, link an issue where a maintainer explicitly approved this scope. A material scope change needs renewed approval before implementation continues.

## 1. Choose the public entrypoint

The entrypoint is part of the user-facing API:

| Entrypoint           | Use it for                                                            | Documentation status                  |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `rooks`              | Stable hooks that do not need an isolated optional dependency         | `stable`                              |
| `rooks/experimental` | Hooks whose API or behavior may change or be removed between releases | `experimental`                        |
| `rooks/temporal`     | Hooks based on `Temporal` and `@js-temporal/polyfill`                 | `stable` unless explicitly deprecated |

Do not export a hook from more than one entrypoint to make imports convenient. Supported aliases are declared deliberately in the appropriate barrel and documented on the canonical hook page.

## 2. Generate the initial files

For an interactive prompt, run:

```bash
pnpm new
```

For automation or a repeatable command, pass all four required values:

```bash
pnpm create:cli --name useExample \
  --description "Manages an example value." \
  --category state \
  --entrypoint rooks
```

`name` is the camel-cased public hook name beginning with `use`. A root-entrypoint hook uses one of these stable route groups: `animation`, `browser`, `dev`, `events`, `form`, `keyboard`, `lifecycle`, `mouse`, `performance`, `state`, `state-history`, `ui`, `utilities`, or `viewport`. A `rooks/experimental` hook uses category `experimental`; a `rooks/temporal` hook uses category `temporal`.

The shared generator creates:

- `packages/rooks/src/hooks/useExample.ts`;
- a typed test under `packages/rooks/src/__tests__`;
- a standardized MDX page in the selected hook category;
- an export in `index.ts`, `experimental.ts`, or `temporal.ts`.

The generator refuses to overwrite an existing file or export. It does not create a changeset because the release level requires human judgment. Follow the focused commands it prints.

## 3. Implement the hook contract

Read nearby hooks and their tests before editing the generated source.

- Keep the public signature small and precisely typed.
- Make parameter defaults observable and documented.
- Clean up event listeners, timers, observers, subscriptions, and disposable resources when dependencies change or the component unmounts.
- Guard `window`, `document`, `navigator`, and other browser-only globals during server rendering.
- Keep the first browser render compatible with the server snapshot to avoid hydration mismatches.
- Prevent stale asynchronous results from overwriting newer work.
- Keep internal option/result types internal unless the approved API explicitly adds a public type export.

Experimental code follows the same correctness bar as stable code. Its status permits API evolution; it does not permit missing cleanup, unsafe server rendering, or untested behavior.

## 4. Write focused tests

Test the contract, not implementation details. Cover the relevant cases:

- initialization and default values;
- each state transition or returned operation;
- callback freshness and dependency changes;
- cleanup on rerender and unmount;
- overlapping asynchronous calls and errors;
- unsupported browser APIs, permissions, or server rendering;
- stable return shape and type inference.

Run the generated file directly:

```bash
pnpm --filter rooks exec vitest run src/__tests__/useExample.spec.ts
```

Use `.spec.tsx` in the command if the generated or completed test contains JSX. Then run:

```bash
pnpm --filter rooks typecheck
pnpm --filter rooks lint
pnpm --filter rooks build
pnpm --filter rooks sanity-check
```

## 5. Complete the reference page

Follow [Authoring documentation](./authoring-documentation.md). The page must use the exact public entrypoint, contain a visible self-contained TSX example, document parameters/defaults and the return value, and explain cleanup, errors, browser support, permissions, server behavior, and accessibility where relevant.

Do not create a second page for an alias. Add the alias to canonical frontmatter and let the manifest provide its search entry and redirect.

Refresh and check generated documentation:

```bash
pnpm docs:generate
pnpm docs:check
```

## 6. Decide the changeset

A new hook or any user-observable change to a published hook needs a changeset, including changes in the experimental and Temporal entrypoints:

```bash
pnpm changeset
```

Choose `patch`, `minor`, or `major` based on compatibility, not file size. Documentation-only follow-up work needs no package changeset when published behavior and API are unchanged.

## 7. Prepare the pull request

Run `pnpm all-checks`, then complete the pull request template with:

- the exact issue approval comment;
- the entrypoint and change type;
- tests and documentation added;
- the changeset or its exemption;
- every command you ran.

If the final patch materially differs from the approved issue scope, obtain renewed maintainer approval before requesting review.

## Related guides

- [Contributing](../CONTRIBUTING.md)
- [Local development](./local-development.md)
- [Authoring documentation](./authoring-documentation.md)
- [Code style](../code-style-guide.md)
