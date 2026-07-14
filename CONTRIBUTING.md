# Contributing to Rooks

Thank you for helping improve Rooks. This repository accepts code, tests, and documentation from contributors whose proposed scope has been approved by a maintainer.

## Approval is required before an external pull request

External contributors must link an issue where a maintainer explicitly approved the scope of the change. This applies to every external pull request, including documentation-only fixes.

- Approval is specific to the scope described in the linked issue.
- If the implementation materially changes that scope, ask for renewed approval before continuing.
- Opening, assigning, or commenting on an issue is not approval unless a maintainer clearly says that the proposed scope is approved.
- Maintainer-authored changes and scheduled automation changes are exempt.

If an existing bug or feature issue describes the exact scope, request approval on that issue. Use the [contribution proposal form](https://github.com/imbhargav5/rooks/issues/new?template=contribution_proposal.yml) when no existing issue describes the proposed change. Please do not invest substantial implementation time before approval.

## Set up the repository

Rooks uses Node.js 22.14.0 and pnpm 10.6.4. From a clone of your fork:

```bash
nvm use
corepack enable
corepack prepare pnpm@10.6.4 --activate
pnpm install
```

See [Local development](./docs/local-development.md) for the full setup, focused test loop, documentation preview, and troubleshooting steps.

## Repository map

| Path                                 | Purpose                                                      |
| ------------------------------------ | ------------------------------------------------------------ |
| `packages/rooks/src/hooks`           | Hook implementations shared by the three public entrypoints  |
| `packages/rooks/src/__tests__`       | Vitest unit, browser-environment, and server-rendering tests |
| `packages/rooks/src/index.ts`        | Stable `rooks` exports                                       |
| `packages/rooks/src/experimental.ts` | `rooks/experimental` exports                                 |
| `packages/rooks/src/temporal.ts`     | `rooks/temporal` exports                                     |
| `apps/website/content/docs`          | The only hand-authored documentation source                  |
| `scripts`                            | Documentation and hook-generation tooling                    |
| `.changeset`                         | Pending release notes and version intent                     |

## Common commands

Run commands from the repository root.

| Task                                    | Command                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------- |
| Run one hook test file                  | `pnpm --filter rooks exec vitest run src/__tests__/useArrayState.spec.ts` |
| Typecheck the package                   | `pnpm --filter rooks typecheck`                                           |
| Lint the package                        | `pnpm --filter rooks lint`                                                |
| Build the package                       | `pnpm --filter rooks build`                                               |
| Start the documentation site            | `pnpm docs:dev`                                                           |
| Refresh the generated README hook zone  | `pnpm docs:generate`                                                      |
| Check generated output without writing  | `pnpm docs:generate --check`                                              |
| Build the production documentation site | `pnpm docs:build`                                                         |
| Validate and build all documentation    | `pnpm docs:check`                                                         |
| Run the full repository gate            | `pnpm all-checks`                                                         |

Use the narrowest command while iterating, then run the checks appropriate to every file you changed. Run `pnpm all-checks` before requesting review.

## Choose the right workflow

- To change a hook, follow [Adding or changing a hook](./docs/adding-a-hook.md) and the [code style guide](./code-style-guide.md).
- To change the website or hook reference, follow [Authoring documentation](./docs/authoring-documentation.md).
- To work on repository tooling, start with [Local development](./docs/local-development.md) and keep generated output deterministic.
- To report a problem or ask for help, use the routes in [SUPPORT.md](./SUPPORT.md).

## Changesets

Run `pnpm changeset` when a pull request changes the behavior or public API of the published `rooks` package. Select the package, choose the semantic version level deliberately, and write a user-facing summary.

A package changeset is not required for documentation-site-only, repository-tooling-only, test-only, or workflow-only changes that do not change the published package. State that exemption in the pull request template. Do not create a changeset automatically from the hook generator because the author must decide the version impact.

## Generated files

The package export barrels and hook MDX files feed the shared documentation manifest. The README hook zone between `<!--hookslist start-->` and `<!--hookslist end-->` is generated from that manifest. The website's `apps/website/src/components/contributors-list-data.ts` file is generated from `.all-contributorsrc` by the same command.

- Edit the source barrel, implementation, tests, or MDX instead of hand-editing the generated README hook zone.
- Edit `.all-contributorsrc` through the contributor workflow instead of hand-editing the generated website contributor data.
- Run `pnpm docs:generate` after a public export or documentation metadata change.
- Run `pnpm docs:generate --check` before review. It fails when generated output is stale without modifying files.

## Pull request expectations

Every pull request should:

1. Link the issue comment that contains scope approval, or identify the maintainer/automation exemption.
2. Stay within the approved scope, or link renewed approval for a material change.
3. Include focused tests for behavior changes and relevant server/browser edge cases.
4. Update user-facing documentation and examples when behavior or API changes.
5. Include a changeset or explain why one is not required.
6. List the exact commands that were run.
7. Leave generated files clean and avoid unrelated formatting or refactors.

The pull request template records each of these items.

## Troubleshooting

- If pnpm reports the wrong version, rerun `corepack prepare pnpm@10.6.4 --activate`.
- If a documentation check reports stale generated output, run `pnpm docs:generate` and review the diff.
- If a browser API test behaves differently in Node.js, confirm whether it needs the default jsdom environment or an explicit `@vitest-environment node` directive.
- If package import sanity checks cannot find build output, run `pnpm --filter rooks build` first.

More setup and recovery details are in [Local development](./docs/local-development.md).
