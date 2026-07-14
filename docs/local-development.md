# How to develop Rooks locally

This guide takes a fresh clone through installation, one focused hook test, a local documentation preview, and the full repository checks.

## Prerequisites

- Git
- `nvm` or another Node version manager that honors `.nvmrc`
- Node.js 22.14.0
- Corepack, included with the supported Node.js release

Run all commands from the repository root unless a step says otherwise.

## Install the workspace

1. Select the repository's Node.js version.

   ```bash
   nvm use
   ```

   If the version is not installed, run `nvm install` and then `nvm use` again.

2. Enable the pinned package manager.

   ```bash
   corepack enable
   corepack prepare pnpm@10.6.4 --activate
   pnpm --version
   ```

   The final command should print `10.6.4`.

3. Install the monorepo dependencies.

   ```bash
   pnpm install
   ```

## Run a focused package loop

Vitest uses jsdom by default and discovers test files under `packages/rooks/src/__tests__`.

```bash
pnpm --filter rooks exec vitest run src/__tests__/useArrayState.spec.ts
pnpm --filter rooks typecheck
pnpm --filter rooks lint
```

Replace the test path with the hook you are changing. Use a `.spec.tsx` file when the test contains JSX.

Build the package when you change exports, package metadata, or generated declarations:

```bash
pnpm --filter rooks build
pnpm --filter rooks sanity-check
```

## Preview the documentation

Start the Fumadocs development server:

```bash
pnpm docs:dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000/docs`. Keep this terminal running while editing MDX.

In a second terminal, validate the documentation source and production build:

```bash
pnpm docs:check
```

If you changed a public export or hook metadata, refresh the generated README hook zone first:

```bash
pnpm docs:generate
pnpm docs:generate --check
```

## Run the repository gate

Before requesting review, run:

```bash
pnpm all-checks
```

This is the same top-level gate used in pull requests. It includes package coverage, typechecking, linting, built-package sanity checks, and documentation validation through the Turbo task graph.

## Fresh-clone verification sequence

Use this exact order when verifying onboarding or CI instructions:

```bash
nvm use
corepack enable
corepack prepare pnpm@10.6.4 --activate
pnpm install
pnpm --filter rooks exec vitest run src/__tests__/useArrayState.spec.ts
pnpm docs:dev
```

After confirming the site in the browser, stop the development server and run:

```bash
pnpm docs:check
pnpm all-checks
```

## Troubleshooting

### Corepack cannot activate pnpm

Confirm that `node --version` reports `v22.14.0`, then rerun:

```bash
corepack enable
corepack prepare pnpm@10.6.4 --activate
```

If your Node installation is read-only, reinstall that Node version through `nvm` instead of installing a global, unpinned pnpm.

### A generated documentation check is stale

Run `pnpm docs:generate`, inspect the resulting diff, and run `pnpm docs:generate --check` again. Do not hand-edit a generated README table or count.

### A browser API is missing in a test

The default Vitest environment is jsdom, but it does not implement every browser API. Stub only the platform surface the test needs and restore it after the test. For server-rendering tests, add this file header:

```typescript
/** @vitest-environment node */
```

### An import sanity check cannot find `dist`

Build the package before running the check:

```bash
pnpm --filter rooks build
pnpm --filter rooks sanity-check
```

### Temporal imports cannot resolve the polyfill

The workspace installs `@js-temporal/polyfill` as the package's optional dependency. Rerun `pnpm install`; do not move Temporal hooks into the root entrypoint.

## Related guides

- [Contributing](../CONTRIBUTING.md)
- [Adding or changing a hook](./adding-a-hook.md)
- [Authoring documentation](./authoring-documentation.md)
- [Code style](../code-style-guide.md)
