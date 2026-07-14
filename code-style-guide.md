# Rooks code style guide

This guide records conventions that match the repository's current TypeScript, React, and Vitest configuration. Prefer the pattern used by neighboring hooks when the guide does not cover a choice.

## TypeScript

Production source extends the shared strict configuration. `strict` and `noUncheckedIndexedAccess` are enabled, the target is ES2022, and browser library types are available.

- Use precise parameter and return types at public boundaries.
- Avoid `any`. Use a generic, a union, `unknown` plus narrowing, or a browser platform type.
- Let TypeScript infer local values when the inferred type is clear.
- Use `type` for unions, tuples, mapped types, and aliases. Use either `type` or `interface` for object shapes; both are established repository patterns.
- Keep implementation-only option and result shapes local unless they are intentionally part of the package API.
- Do not add a type to an entrypoint barrel merely to make a documentation example importable. Only explicitly barrel-exported types are public.

Hook implementations live at `packages/rooks/src/hooks/useName.ts` and use named exports. Public availability is controlled by one of the entrypoint barrels:

| Entrypoint           | Barrel                               | Contract                                                        |
| -------------------- | ------------------------------------ | --------------------------------------------------------------- |
| `rooks`              | `packages/rooks/src/index.ts`        | Stable hooks and explicitly supported aliases                   |
| `rooks/experimental` | `packages/rooks/src/experimental.ts` | APIs that may change or be removed between releases             |
| `rooks/temporal`     | `packages/rooks/src/temporal.ts`     | Temporal hooks isolated with their optional polyfill dependency |

Do not export the same implementation from multiple entrypoints unless the public API explicitly calls for an alias.

## React hook behavior

- Start public hook names with `use` and obey the Rules of Hooks.
- Make default parameter values explicit in the function signature when they are part of the contract.
- Include every reactive value used by an effect or memoized callback in its dependency list. When a long-lived subscription should call the latest callback without being recreated, use the repository's fresh-ref/fresh-callback patterns.
- Return a cleanup function from effects that install event listeners, timers, observers, subscriptions, or other resources.
- Clear or replace resources before installing a new one when dependencies change.
- For asynchronous work, prevent stale completions from replacing newer state. Use cancellation when the platform supports it or a request/generation identifier when it does not.
- Do not update state after unmount. Tests should cover cleanup and overlapping work when those risks exist.

## Browser APIs and server rendering

Browser globals do not exist during server rendering. Guard access with checks such as `typeof window !== "undefined"`, `typeof document !== "undefined"`, or `typeof navigator !== "undefined"` before using the corresponding API.

- Keep the initial server snapshot deterministic.
- Avoid a different first client render that would produce a hydration mismatch. Hydration is React attaching behavior to server-rendered markup; the first client output must agree with that markup.
- Install browser listeners and request permissions in an effect unless the API contract requires another lifecycle.
- Report unsupported browser features through the hook's documented fallback instead of throwing accidentally.
- Use `useIsomorphicEffect` only when layout timing is required. A normal effect is easier to render on the server.
- Cover browser-only hooks in jsdom tests and add or extend `packages/rooks/src/__tests__/ssr.spec.ts` when server safety is part of the contract.

## Tests

Tests live in `packages/rooks/src/__tests__`. Existing hook tests and the generator use `*.spec.ts` or `*.spec.tsx`; follow that convention for new hook tests and use `.tsx` when the file contains JSX. Vitest is configured to discover `*.test.ts` and `*.test.tsx` as well for existing or specialized tests.

- Vitest globals such as `describe`, `it`, `expect`, and lifecycle hooks are configured by the test project.
- The default environment is jsdom. Add `/** @vitest-environment node */` when a test must prove behavior without browser globals.
- Use `renderHook` for isolated hooks and React Testing Library rendering for component-visible behavior.
- Wrap state-changing calls and timer advancement in `act`.
- Use `vi.fn`, `vi.spyOn`, and `vi.useFakeTimers` for observable dependencies. Restore mocks, real timers, and patched globals after each test.
- Assert initial behavior, updates, cleanup, dependency changes, unsupported-platform behavior, and error paths that are part of the hook's contract.
- Keep tests deterministic. Do not depend on the network, wall-clock time, browser permissions, or test order.
- Follow the existing convention of `expect.hasAssertions()` when a test contains asynchronous or callback-driven assertions that could otherwise be skipped.

Run one test directly while iterating:

```bash
pnpm --filter rooks exec vitest run src/__tests__/useArrayState.spec.ts
```

## Documentation

Every canonical public hook needs one page under `apps/website/content/docs/hooks/(category)`. The page must use the public entrypoint, describe exact defaults and cleanup behavior, and contain a self-contained TypeScript/TSX example with visible output.

Aliases belong on the canonical page. Internal helpers do not get public reference pages. Follow [Authoring documentation](./docs/authoring-documentation.md) for frontmatter, required sections, examples, and validation commands.

## Formatting and checks

Prettier owns formatting. ESLint and TypeScript own mechanical correctness; this guide does not override them.

```bash
pnpm --filter rooks lint
pnpm --filter rooks typecheck
pnpm --filter rooks exec vitest run src/__tests__/useArrayState.spec.ts
pnpm docs:check
pnpm all-checks
```

Run the focused commands for the files you changed, then the full gate before review.
