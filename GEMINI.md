# Rooks contributor instructions

Use the repository's canonical guides instead of maintaining separate agent-specific rules:

- [Contributing and scope approval](./CONTRIBUTING.md)
- [Local development](./docs/local-development.md)
- [Adding or changing a hook](./docs/adding-a-hook.md)
- [Authoring documentation](./docs/authoring-documentation.md)
- [Code style](./code-style-guide.md)
- [Maintenance and releases](./MAINTENANCE.md)

Treat the package export map and the three TypeScript entrypoint barrels as public API truth. Preserve unrelated worktree changes, run focused checks while iterating, and run `pnpm all-checks` before review.
