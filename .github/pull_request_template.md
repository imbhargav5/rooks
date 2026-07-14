## Approved issue

External pull requests, including documentation-only fixes, must link the exact issue comment where a maintainer approved this scope. Maintainer-authored and scheduled automation changes are exempt.

- Approved issue: <!-- #123 -->
- Approval comment: <!-- https://github.com/imbhargav5/rooks/issues/123#issuecomment-... -->
- Exemption, if applicable: <!-- maintainer-authored / scheduled automation -->

- [ ] The implementation stays within the approved scope.
- [ ] Any material scope change has renewed maintainer approval linked above.

## Summary

<!-- What changed, why it changed, and what users will observe. -->

## Change type

- [ ] Bug fix
- [ ] New hook or feature
- [ ] Existing API or behavior change
- [ ] Documentation or examples
- [ ] Tests or internal tooling
- [ ] CI, release, or repository maintenance

## Entrypoint or surface

- [ ] `rooks`
- [ ] `rooks/experimental`
- [ ] `rooks/temporal`
- [ ] Documentation website only
- [ ] Repository tooling/workflows only

## Verification

### Tests

<!-- Name focused tests added or changed, including browser/SSR/error cases. -->

- [ ] New or changed behavior has focused tests.
- [ ] Server rendering, hydration, browser support, permissions, cleanup, and accessibility were considered where relevant.

### Documentation and examples

<!-- Link the updated hook page, guide, or explain why user-facing docs are unchanged. -->

- [ ] Public behavior/API changes include accurate documentation and a self-contained example.
- [ ] The generated README hook zone is current (`pnpm docs:generate --check`).

### Changeset

- [ ] Added a changeset for published package behavior or API.
- [ ] No changeset is required because this does not change the published package.

Exemption reason: <!-- Required when no changeset is included. -->

## Commands run

<!-- List exact commands and whether they passed. Example: -->

```text
pnpm --filter rooks exec vitest run src/__tests__/useExample.spec.ts
pnpm docs:check
pnpm all-checks
```

## Notes for reviewers

<!-- Migration concerns, deliberate trade-offs, follow-up work, screenshots, or manual QA. -->
