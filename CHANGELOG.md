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
  