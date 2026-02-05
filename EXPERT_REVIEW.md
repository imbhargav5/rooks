# Rooks Expert Review: Multi-Agent Analysis

> **Date**: February 2026
> **Methodology**: Three-agent parallel analysis — React Hooks Expert, GitHub Actions/CI Expert, and Senior Architect/Team Lead

---

## Executive Summary

Rooks is a **mature, well-documented React hooks library** with 131 main hooks + 5 experimental hooks (136 total). The project has strong community engagement (82+ contributors), professional documentation, and a solid monorepo architecture. However, this review uncovered **critical code-level bugs in several hooks**, **disabled CI safety nets**, and **architectural gaps** that, if addressed, would significantly improve reliability and competitiveness.

**Overall Scores:**

| Area | Score | Verdict |
|------|-------|---------|
| Hook Quality & Correctness | 6/10 | Critical bugs in several hooks |
| Testing | 7/10 | Good coverage but key suites skipped |
| CI/CD | 7/10 | Mature but gaps in security/monitoring |
| Documentation | 9/10 | Excellent README, docs site, contributing guide |
| Architecture | 8/10 | Clean monorepo, modern tooling |
| Developer Experience | 9/10 | Low-friction contribution, great onboarding |
| Bundle & Distribution | 6/10 | ESM-only is good, but size-limit broken |

---

## Part 1: React Hooks Expert Findings

### 1.1 Critical Hook Bugs (HIGH severity)

#### A. `useAsyncEffect` — Race condition in cleanup
- **File**: `packages/rooks/src/hooks/useAsyncEffect.ts:42-65`
- **Issue**: `callback().then()` is called but not awaited before cleanup fires. The cleanup effect at lines 61-63 may fire before the async operation completes, causing `result` to be undefined.
- **Impact**: Memory leaks and incorrect cleanup behavior.

#### B. `useDebounce` — Stale closure
- **File**: `packages/rooks/src/hooks/useDebounce.ts:40-61`
- **Issue**: `debouncedCallbackRef` is initialized once (line 54). When `wait` or `options` change, `createDebouncedCallback` creates a new debounced function, but the ref is never updated. Consumers get stale debounced functions.
- **Impact**: Changing `wait`/`leading`/`trailing` options after initial render has no effect.
- **Note**: The entire test suite for this hook is **skipped** (`describe.skip`).

#### C. `useLocalstorageState` — Boolean logic error + shallow comparison
- **File**: `packages/rooks/src/hooks/useLocalstorageState.ts:81-86, 95, 130`
- **Issue 1**: Line 82 uses `!ref1.current || !ref2.current` — since both start as `false`, this evaluates to `true || true = true`, so it *always* saves. Should be `&&` (AND).
- **Issue 2**: Lines 95, 130 use `!==` for object values, which always returns `true` for non-primitives.
- **Impact**: Storage synchronization bugs, potential infinite update loops.

### 1.2 Medium-High Severity Issues

#### D. `useDebounceFn` — Incorrect `useFreshCallback` usage
- **File**: `packages/rooks/src/hooks/useDebounceFn.ts:52, 60, 71, 101, 118`
- **Issue**: `funcRef(...)` is called directly as if it returns a value, but `useFreshCallback` returns a callback. The invocation pattern is inconsistent with fresh ref semantics.
- **Impact**: Potential TypeError at runtime.

#### E. `useEventListenerRef` — Missing dependency
- **File**: `packages/rooks/src/hooks/useEventListenerRef.ts:31, 44`
- **Issue**: `freshCallback` (line 31) is used in the effect (line 39) but missing from the dependency array (line 44).
- **Impact**: Stale event listeners persist after callback updates; memory leaks.

#### F. `useGlobalObjectEventListener` — Incomplete dependency array
- **File**: `packages/rooks/src/hooks/useGlobalObjectEventListener.ts:38-67`
- **Issue**: Dependency array at line 67 is `[eventName, listenerOptions]` but misses `globalObject`, `when`, and `freshCallback`.
- **Impact**: Event listeners not re-attached when key parameters change.

#### G. `useFetch` — Multiple anti-patterns
- **File**: `packages/rooks/src/hooks/useFetch.ts:51-56, 159`
- **Issue 1**: `new Promise(async (resolve, reject) => ...)` — async inside Promise constructor is an anti-pattern.
- **Issue 2**: `new AbortController()` created at line 55 but never used — signal is discarded.
- **Issue 3**: `options` in dependency array (line 159) causes re-fetches if created inline.
- **Impact**: Resource leaks, unnecessary network requests.

### 1.3 API Design Inconsistencies

| Pattern | Examples | Concern |
|---------|----------|---------|
| Return types | `useCounter` returns object, `useToggle` returns tuple | Inconsistent consumer API |
| Naming casing | `useLocalstorageState`, `useBoundingclientrect` | Should be `useLocalStorageState`, `useBoundingClientRect` |
| Error handling | `useGeolocation` resolves errors as values instead of rejecting | Breaks Promise semantics |
| State setter in deps | `useMapState`, `useSetState` include `setState` in `useCallback` deps | Unnecessary — dispatch is stable |

### 1.4 Testing Gaps

- **20 skipped test suites/cases** across 15 hooks
- **`useDebounce`**: Entire test suite disabled (`describe.skip`) despite known bugs
- **Missing test files**: `useGlobalObjectEventListener`, `useMergeRefs`, `useRefElement`
- **Typo**: `useMultiSelectableList` test file named `useMutilSelectableList`

### 1.5 React 18/19 Compatibility

**Good:**
- `useSyncExternalStore` adopted in 12 hooks (useOnline, useMediaMatch, useMouse, etc.)
- Proper SSR guards (`typeof window !== "undefined"`)
- `useIsomorphicEffect` for SSR-safe layout effects
- Peer deps correctly specify `react: ^18.0.0 || ^19.0.0`

**Missing React 19 features:**
- No hooks leveraging `useTransition`, `useDeferredValue`, `useId`
- No `useActionState` or `useFormStatus` integration
- No `useOptimistic` for optimistic UI patterns
- Opportunity: Form hooks (`useInput`, `useFormState`) could benefit from React 19 form actions

---

## Part 2: GitHub Actions & CI/CD Expert Findings

### 2.1 Workflow Inventory

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| PR Validation | `.github/workflows/pr.yml` | Pull requests | Build, test, coverage, lint |
| CI Release | `.github/workflows/ci-release.yml` | Push to main/alpha/next | Test + publish via Changesets |
| Contributors | `.github/workflows/contributors.yml` | Weekly cron + manual | Update contributor list |

### 2.2 What's Working Well

- **Turbo-powered monorepo** orchestration with proper task dependencies
- **Changesets** for semantic versioning with GitHub changelog generation
- **Multi-branch release strategy**: main, alpha, next
- **Intelligent caching**: pnpm + node_modules multi-level cache with lock-file hash key
- **Concurrency control**: Cancels in-progress runs on same PR/branch
- **Reusable CI setup action** at `.github/actions/ci-setup/action.yml`
- **Pre-commit hooks** via Husky + lint-staged (disabled in CI)
- **Comprehensive check pipeline**: `all-checks` depends on coverage, typecheck, lint, sanity-check

### 2.3 Critical CI/CD Issues

#### A. Bundle Size Tracking DISABLED
- **File**: `.github/workflows/pr.yml:25-34`
- **Status**: `size-limit-action` is **commented out**
- **Config mismatch**: `.size-limit.js` references non-existent CJS/UMD builds
- **Impact**: No automated bundle size regression detection on PRs

#### B. No Security Scanning
- Missing CodeQL analysis workflow
- Missing SAST (Static Application Security Testing)
- Missing Snyk/dependency vulnerability scanning
- No `SECURITY.md` file
- No signed commits enforcement

#### C. Codecov Configuration Issues
- Uses `codecov/codecov-action@v2` (outdated — v4 is current)
- No coverage threshold enforcement
- No PR comment with coverage delta

### 2.4 Missing CI/CD Best Practices

| Feature | Status | Recommendation |
|---------|--------|----------------|
| Bundle size tracking | Commented out | Fix `.size-limit.js`, re-enable action |
| Security scanning (CodeQL) | Missing | Add CodeQL workflow |
| Matrix builds (Node versions) | Missing | Test on Node 18, 20, 22 |
| Parallel CI jobs | Missing | Split test/lint/typecheck into parallel jobs |
| Coverage thresholds | Missing | Enforce minimum via Codecov config |
| PR labeling automation | Missing | Add labeler action based on changed files |
| Branch protection | Missing | Enforce status checks, require reviews |
| Changeset validation | Missing | Require changeset file on PRs |
| Dependency update pinning | Partial | Renovate configured but no digest pinning |

### 2.5 Build Pipeline Summary

- **Build tool**: esbuild (fast, ESM-only output with code splitting)
- **TypeScript declarations**: Generated via `tsc` + `tsc-alias` for path resolution
- **Sanity checks**: 4-step post-build validation (ES version, types, imports, ESLint)
- **Test framework**: Vitest 2.1.0 with jsdom, forks pool, v8 coverage

---

## Part 3: Architect / Team Lead Gap Analysis

### 3.1 Architecture Strengths

1. **Clean monorepo structure**: `packages/rooks`, `packages/eslint-config`, `packages/typescript-config`, `apps/website`
2. **Minimal production deps**: Only 4 (`fast-deep-equal`, `lodash.debounce`, `raf`, `use-sync-external-store`)
3. **Tree-shakeable**: `sideEffects: false`, ESM with code splitting
4. **Professional community health**: MIT license, Code of Conduct, issue templates, 82+ contributors
5. **Modern stack**: React 19 support, TypeScript 5.8, Vitest, Turbo, pnpm 10

### 3.2 Technical Debt

#### Console Statements in Production Code
- **82+ instances** of `console.log/warn/error/debug` across hooks
- Some intentional (`useLifecycleLogger`, `useWhyDidYouUpdate`) but many are not
- Affected hooks: `useNotification`, `useBroadcastChannel`, `useVibrate`, `usePreferredColorScheme`, `useLocalstorageState`, `useMultiSelectableList`, `useDidUpdate`, and more
- **Recommendation**: Strip console calls in production builds via esbuild plugin, keep only in intentional debugging hooks

#### Type Safety Violations
- **13+ instances of `any`** despite strict TypeScript config
- Key offenders: `useFormState` (4 instances), `useFetch`, `useWebWorker`, `useWebLocksApi`, `useNotification`, `useKeys`
- **Recommendation**: Replace with `unknown` + type guards or proper generics

#### Deprecated/Planned Deprecations
- `useAnimation` deprecated in favor of `useEasing` (proper deprecation warning in place)
- `useInput` has TODO indicating planned deprecation
- `useUndoRedoState` has deprecated method markers

### 3.3 Competitive Gaps (vs react-use, usehooks-ts, ahooks)

| Feature | Rooks | react-use | usehooks-ts | ahooks |
|---------|-------|-----------|-------------|--------|
| Total hooks | 136 | ~120 | ~50 | ~60 |
| Bundle size monitoring | Disabled | Active | Active | Active |
| Subpath exports | No | No | Yes | Yes |
| Interactive playground | No | Storybook | No | Yes |
| React 19 features | No | No | Partial | No |
| Form validation | No | No | No | Yes |
| Pagination/infinite scroll | No | No | No | Yes |
| Performance benchmarks | No | No | No | Yes |
| Hook selection guide | No | No | No | Yes |

### 3.4 Bundle & Distribution Concerns

- **ESM-only**: Correct modern decision, but some Node.js CommonJS scripts can't consume
- **No subpath exports**: Can't do `import { useCounter } from "rooks/useCounter"` — reliant on bundler tree-shaking
- **Size-limit config broken**: References CJS/UMD outputs that don't exist
- **No bundle analysis in CI**: Can't detect size regressions

### 3.5 Documentation Site

- **Stack**: Next.js 16, React 19, Fumadocs, TailwindCSS 4
- **Content**: 128+ MDX documentation pages
- **Strength**: Comprehensive per-hook docs with examples
- **Gap**: No interactive playground, no API automation (manual docs), no hook decision tree

---

## Part 4: Prioritized Recommendations

### Tier 1 — Critical (Fix Now)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Fix `useDebounce` stale closure bug and re-enable tests | Users get wrong behavior after re-render | Low |
| 2 | Fix `useLocalstorageState` boolean logic (`\|\|` → `&&`) and object comparison | Infinite loops, sync bugs | Low |
| 3 | Fix `useAsyncEffect` race condition in cleanup | Memory leaks | Medium |
| 4 | Fix `useEventListenerRef` missing dependency | Stale event listeners | Low |
| 5 | Fix `.size-limit.js` to match actual ESM-only build | Broken config | Low |
| 6 | Re-enable size-limit CI action in `pr.yml` | No regression detection | Low |

### Tier 2 — High Priority (Next Sprint)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 7 | Fix `useGlobalObjectEventListener` dependency array | Missed event re-attachments | Low |
| 8 | Fix `useDebounceFn` incorrect `useFreshCallback` usage | Potential runtime errors | Medium |
| 9 | Fix `useFetch` anti-patterns (AbortController, async Promise) | Resource leaks | Medium |
| 10 | Remove/strip 82+ console statements from production code | Bundle bloat, console pollution | Medium |
| 11 | Replace 13+ `any` types with proper generics/unknown | Type safety violations | Medium |
| 12 | Add CodeQL security scanning workflow | No vulnerability detection | Low |
| 13 | Upgrade Codecov action from v2 to v4 | Outdated CI action | Low |

### Tier 3 — Medium Priority (Next Month)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 14 | Un-skip disabled test suites (20 skipped across 15 hooks) | Untested code paths | Medium |
| 15 | Add missing test files (useGlobalObjectEventListener, useMergeRefs, useRefElement) | Zero test coverage | Medium |
| 16 | Add Node version matrix testing (18, 20, 22) | Compatibility assurance | Low |
| 17 | Split CI into parallel jobs (test \| lint \| typecheck) | Faster CI | Low |
| 18 | Enforce coverage thresholds in CI | Prevent regression | Low |
| 19 | Add changeset validation to PR workflow | Prevent missing changelogs | Low |
| 20 | Add branch protection rules + CODEOWNERS | Code review enforcement | Low |

### Tier 4 — Strategic (Quarter)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 21 | Add subpath exports for per-hook imports | Better tree-shaking for Webpack | Medium |
| 22 | Add React 19 feature hooks (useActionState, useOptimistic, useId) | Competitive parity | High |
| 23 | Create hook selection/decision guide | User experience | Medium |
| 24 | Add interactive playground to docs site | Discoverability | High |
| 25 | Add pagination, infinite scroll, form validation hooks | Feature completeness | High |
| 26 | Standardize API patterns (object vs tuple returns) | Consistency | High |
| 27 | Fix naming inconsistencies (localStorage casing, boundingClientRect) | Would require major version | High |

---

## Appendix: Files Referenced

### Hook Files with Bugs
- `packages/rooks/src/hooks/useAsyncEffect.ts`
- `packages/rooks/src/hooks/useDebounce.ts`
- `packages/rooks/src/hooks/useDebounceFn.ts`
- `packages/rooks/src/hooks/useLocalstorageState.ts`
- `packages/rooks/src/hooks/useEventListenerRef.ts`
- `packages/rooks/src/hooks/useGlobalObjectEventListener.ts`
- `packages/rooks/src/hooks/useFetch.ts`
- `packages/rooks/src/hooks/useFreshRef.ts`
- `packages/rooks/src/hooks/useMapState.ts`
- `packages/rooks/src/hooks/useSetState.ts`
- `packages/rooks/src/hooks/useGeolocation.ts`

### CI/CD Files
- `.github/workflows/pr.yml`
- `.github/workflows/ci-release.yml`
- `.github/workflows/contributors.yml`
- `.github/actions/ci-setup/action.yml`
- `packages/rooks/.size-limit.js`
- `.changeset/config.json`
- `.mergify.yml`
- `turbo.json`

### Config Files
- `packages/rooks/vitest.config.ts`
- `packages/rooks/build.js`
- `packages/rooks/tsconfig.json`
- `.eslintrc.js`
- `prettier.config.cjs`
- `.husky/pre-commit`
