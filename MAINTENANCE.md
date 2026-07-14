# Rooks maintenance and release runbook

Rooks releases only from `main`. GitHub Actions creates the Version Packages pull request, publishes to npm through trusted publishing, and creates or updates the matching GitHub release. Do not publish from `alpha`, `next`, a local checkout, or by running `pnpm release` directly.

## 1. Require changesets for published changes

Every pull request that changes the behavior or public API of the published `rooks` package needs a changeset:

```bash
pnpm changeset
```

Choose the semantic version level deliberately:

- `patch`: backwards-compatible fixes to existing behavior.
- `minor`: new backwards-compatible public behavior or API.
- `major`: a breaking change to an existing public contract.

The changeset summary should tell package users what changed. New stable, experimental, or Temporal hooks are published API and need a changeset.

A package changeset is normally exempt when a pull request only changes the documentation site, repository documentation, tests, CI/workflows, or internal tooling and does not alter the published package. The pull request must state the exemption. Maintainers should ask for a changeset whenever the package impact is uncertain.

## 2. Create and review the Version Packages pull request

Each push to `main` starts `.github/workflows/ci-release.yml`.

1. The workflow installs dependencies and runs `pnpm all-checks`.
2. After checks pass, `changesets/action` runs `pnpm run version`.
3. The action creates or updates the **Version Packages** pull request from the pending files in `.changeset`.
4. Review the package version, `packages/rooks/CHANGELOG.md`, peer dependency updates, and removal of consumed changeset files.
5. Wait for the pull request checks to pass.

Do not edit a version or changelog on `main` to bypass the Version Packages pull request. If the generated result is wrong, fix the source changeset or versioning logic and let the action update the pull request.

## 3. Merge and publish through trusted publishing

Merge the Version Packages pull request into `main` with a commit title that starts with `Version Packages`. That title is the automatic publish trigger in `.github/workflows/publish.yml`.

The publish workflow:

1. builds the package with `pnpm turbo prepare-publish`;
2. reads the package name and version from `packages/rooks/package.json`;
3. skips npm publication when that exact version already exists;
4. publishes from GitHub Actions with npm trusted publishing and OIDC;
5. creates or updates the `rooks@<version>` GitHub release from the package changelog.

The job requires `id-token: write` and an npm trusted publisher configured for this repository and workflow. Do not add a long-lived npm token as a fallback.

## 4. Verify npm and the GitHub release

Set `VERSION` to the version in the merged package file:

```bash
VERSION=$(node -p "require('./packages/rooks/package.json').version")
npm view "rooks@$VERSION" version
gh release view "rooks@$VERSION"
```

Then install the published package into an empty temporary project and load all three entrypoints:

```bash
SMOKE_DIR=$(mktemp -d)
cd "$SMOKE_DIR"
npm init -y
npm install "rooks@$VERSION" react@19 react-dom@19 @js-temporal/polyfill
node --input-type=module -e '
  const stable = await import("rooks");
  const experimental = await import("rooks/experimental");
  const temporal = await import("rooks/temporal");
  if (typeof stable.useCounter !== "function") throw new Error("stable entrypoint failed");
  if (typeof experimental.useDisposable !== "function") throw new Error("experimental entrypoint failed");
  if (typeof temporal.useTemporalNow !== "function") throw new Error("temporal entrypoint failed");
  console.log("all entrypoints loaded");
'
```

Verify that the command prints `all entrypoints loaded`. The Temporal import also proves that the optional polyfill can be resolved.

## 5. Safe reruns and partial-failure recovery

Both release workflows are designed to be rerun from GitHub Actions.

| Failure                                                          | Recovery                                                                                                                                           |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checks fail before a Version Packages PR is updated              | Fix the failure on `main`; the next successful run updates the same release PR.                                                                    |
| The Version Packages PR conflicts with `main`                    | Bring the release branch up to date or let the next successful Changesets run refresh it. Keep the pending changesets intact.                      |
| The Version Packages PR merged but publish did not start         | Manually dispatch **Publish to NPM** on `main`. Confirm the merged commit and package version first.                                               |
| Build or trusted publishing fails before npm accepts the version | Fix the workflow/configuration issue, then rerun or manually dispatch the publish workflow on `main`.                                              |
| npm succeeds but GitHub release creation fails                   | Rerun the publish workflow. The npm existence check skips the immutable published version and the release step creates or updates the release.     |
| The GitHub release exists with incomplete notes                  | Correct the changelog source if needed, then rerun. The workflow edits an existing release for the same tag.                                       |
| npm trusted publishing rejects OIDC                              | Verify the npm trusted publisher repository/workflow configuration and the job's `id-token: write` permission. Do not fall back to a stored token. |
| A faulty version is already public                               | Publish a corrective patch through a new changeset. Do not try to reuse, decrement, or overwrite an npm version.                                   |

Before rerunning publication, compare these three values: `packages/rooks/package.json`, `npm view rooks version`, and the `rooks@<version>` GitHub release. Stop if they indicate different intended releases rather than a retry of the same release.

## 6. Maintain release and support policy

- Keep `.changeset/config.json` based on `main`.
- Keep release workflow branch filters and job guards restricted to `refs/heads/main`.
- When a new major becomes current, update [SECURITY.md](./SECURITY.md) so the supported line remains explicit.
- Route security fixes through a private GitHub advisory until disclosure is coordinated.
- Treat release credentials, trusted-publisher configuration, and workflow permission changes as security-sensitive maintenance.
