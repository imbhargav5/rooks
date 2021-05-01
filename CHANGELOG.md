<!-- DO NOT CHANGE THESE COMMENTS - See .github/actions/trigger-github-release/update-changelog.js -->
<!-- insert-new-changelog-here -->
























## v3.6.0-canary.0 (2019-12-25)

#### :rocket: New Feature
* `fullscreen`, `storybook`
  * [#194](https://github.com/imbhargav5/rooks/pull/194) Feat/144/add use fullscreen (#150) ([@imbhargav5](https://github.com/imbhargav5))

#### :house: Internal
* `boundingclientrect-ref`, `countdown`, `docusaurus`, `fork-ref`, `geolocation`, `intersection-observer-ref`, `isomorphic-effect`, `mutation-observer-ref`, `outside-click-ref`
  * [#195](https://github.com/imbhargav5/rooks/pull/195) Remove travis integration ([@imbhargav5](https://github.com/imbhargav5))
* Other
  * [#193](https://github.com/imbhargav5/rooks/pull/193) Fix rebase action ([@imbhargav5](https://github.com/imbhargav5))
  * [#192](https://github.com/imbhargav5/rooks/pull/192) Add rebase github action ([@imbhargav5](https://github.com/imbhargav5))

#### :memo: Documentation
* `docusaurus`
  * [#191](https://github.com/imbhargav5/rooks/pull/191) Improvements to docusaurus website ([@imbhargav5](https://github.com/imbhargav5))
  * [#190](https://github.com/imbhargav5/rooks/pull/190) Fix typo on website ([@1337MARCEL](https://github.com/1337MARCEL))














## v3.5.1 (2019-12-18)

#### :memo: Documentation
* `docusaurus`
  * [#186](https://github.com/imbhargav5/rooks/pull/186) Switch site to docusaurus ([@imbhargav5](https://github.com/imbhargav5))
  
#### :house: Internal
* [#182](https://github.com/imbhargav5/rooks/pull/182) Bump rollup-plugin-typescript2 from 0.24.0 to 0.24.3 ([@dependabot-preview[bot]](https://github.com/apps/dependabot-preview))






# 3.4.3

- Added new useCountdown hook

# 3.4.2

- Fix types for useOutsideClickRef hook
- Internal bug fixes

# v3.4.0

- New useBoundingclientrectRef hook
- New useForkRef hook
- New useOutsideClickRef hook
- New useIsomorphicEffect hook
- New useMutationObserverRef hook
- New useIntersectionObserverRef hook
- Minor bug fixes

# v3.3.0

- New useGeolocation hook
- New useThrottle hook
- Minor bug fixes

#v3.2.2

- Fix a minor bug in useKeys

#v3.2.0

- New hooks added

  - `useOnWindowResize`
  - `useOnWindowScroll`
  - `useKeys`

- Allow localStorage and sessionStorage to store all kinds of values.

#v3.1

- New hook added `useDebounce`

# v3

- Critical bug with useKey with refs not detected was fixed
- `useWindowSize` now returns `innerHeight`, `innerWidth`, `outerHeight` and `outerWidth`. It no longer returns `height` and `width` which were ambiguous.
- `useWorker` has a new signature.
- `useInterval` had issues with `useState` which have been resolved
- `usePrevious` has a much simpler implementation using `useRef`
- `typescript` types have been added to all the hooks
- Storybook website has been added
- Uniform major package version for all packages. It makes development easier and it also helps tracking compatibility.

# v2

- `useToggle` v2.0.0 Return value is now an array with two values instead of an object

# Older

- `useInterval`

  - [1.2.1](https://github.com/imbhargav5/rooks/compare/@rooks/use-interval@1.2.0...@rooks/use-interval@1.2.1) (2019-02-21)

  - Updated the `useInteval` hook to use [Dan Abramov's implementation](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) while still maintaining the original Rooks function signature and return value.

  -[1.1.1](https://github.com/imbhargav5/rooks/compare/@rooks/use-interval@1.1.0...@rooks/use-interval@1.1.1) (2019-01-20)

- `useOutsideClick`
  - Fix SSR bug introduced
  - Also look for touch listeners now
- `rooks`
  - Dev [`#21`](https://github.com/react-hooks-org/rooks/pull/21)
  - Home page [`#20`](https://github.com/react-hooks-org/rooks/pull/20)
  - Create CODE_OF_CONDUCT.md [`#1`](https://github.com/react-hooks-org/rooks/pull/1)
  - wip [`c5042c2`](https://github.com/react-hooks-org/rooks/commit/c5042c20d3516ae37f81a0589dd2ec782da82019)
  - Updates [`addd73a`](https://github.com/react-hooks-org/rooks/commit/addd73a7a3fca200ac5343efbe6a8545c463e282)
  - Test with terser installed [`7f8b1fc`](https://github.com/react-hooks-org/rooks/commit/7f8b1fcfff8ef59c48a784696ebe5dc51017eb57)
