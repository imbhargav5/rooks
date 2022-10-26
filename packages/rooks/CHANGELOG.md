# rooks

## 7.4.1

### Patch Changes

- [#1556](https://github.com/imbhargav5/rooks/pull/1556) [`2511d61e`](https://github.com/imbhargav5/rooks/commit/2511d61e5943e32ccbe7804132115c8e62fc2ea0) Thanks [@reflog](https://github.com/reflog)! - fix(useMediaMatch): safari 13.1 addListener fix

## 7.4.0

### Minor Changes

- [`85395a0c`](https://github.com/imbhargav5/rooks/commit/85395a0ceb992d32f420c4dd84b6937ba1a092ce) Thanks [@imbhargav5](https://github.com/imbhargav5)! - add insertItemAtIndex and sort controls to useArrayState

## 7.3.0

### Minor Changes

- [`f2ee3a66`](https://github.com/imbhargav5/rooks/commit/f2ee3a66be7eda8c217a080574275d97f37cbea5) Thanks [@imbhargav5](https://github.com/imbhargav5)! - add splice, removeItemAtIndex and replaceItemAtIndex controls for useArrayState

## 7.2.1

### Patch Changes

- [`e9e03e42`](https://github.com/imbhargav5/rooks/commit/e9e03e42d231f8b122738b59cdea117f7acdb3df) Thanks [@imbhargav5](https://github.com/imbhargav5)! - Add setArray method to array controls

## 7.2.0

### Minor Changes

- [`41796346`](https://github.com/imbhargav5/rooks/commit/41796346759c275ef08cfea6c5fe3af44e1a8e38) Thanks [@imbhargav5](https://github.com/imbhargav5)! - Add updateItemAtIndex control for useArrayState hook

## 7.1.2

### Patch Changes

- [#1408](https://github.com/imbhargav5/rooks/pull/1408) [`fec6932b`](https://github.com/imbhargav5/rooks/commit/fec6932bb0e5120ab448ed7b3318db7e16289b12) Thanks [@imbhargav5](https://github.com/imbhargav5)! - Restore support for es2017 in dist files

- [`2ff6c4fc`](https://github.com/imbhargav5/rooks/commit/2ff6c4fc28739cd82b952b16c287d741fc44c937) Thanks [@imbhargav5](https://github.com/imbhargav5)! - update type signature for anyFunction

## 7.1.2-alpha.1

### Patch Changes

- [`2ff6c4fc`](https://github.com/imbhargav5/rooks/commit/2ff6c4fc28739cd82b952b16c287d741fc44c937) Thanks [@aso1datov](https://github.com/aso1datov)! - update type signature for anyFunction

## 7.1.2-alpha.0

### Patch Changes

- [#1408](https://github.com/imbhargav5/rooks/pull/1408) [`fec6932b`](https://github.com/imbhargav5/rooks/commit/fec6932bb0e5120ab448ed7b3318db7e16289b12) Thanks [@imbhargav5](https://github.com/imbhargav5)! - Restore support for es2017 in dist files

## 7.1.1

### Patch Changes

- bea1ddaf: fix isNumber import in usetimeTravelState

## 7.1.0

### Minor Changes

- 0dc2004e: New hook! useTimeTravelState hook added which can undo and redo a state variable seamlessly.

## 7.0.0

### Major Changes

- ae9a465a: useFullscreen hook rewrite

### Patch Changes

- b2003b87: bundle size decrease
- 886a6721: Make useKey target option support undefined

## 7.0.0-alpha.2

### Patch Changes

- 886a6721: Make useKey target option support undefined

## 7.0.0-alpha.1

### Patch Changes

- b2003b87: bundle size decrease

## 6.4.3

### Patch Changes

- 140fceab: fix dependency checking in useAsyncEffect

## 7.0.0-alpha.0

### Major Changes

- 9ca2be66: useFullscreen hook rewrite

## 6.4.2

### Patch Changes

- 47e847ae: bugfix: window (or document) is not defined when using ssr

## 6.4.1

### Patch Changes

- 19b280fa: decrease bundle size

## 6.4.0

### Minor Changes

- 182e8498: add useArrayState and useSetState hooks to manage arrays and sets

## 6.3.0

### Minor Changes

- 2eac1e11: add useFocus & useFocusWithin hooks

## 6.2.1

### Patch Changes

- e3866ce5: useKeys comes with a new preventLostKeyup option for native events
- 7aea2fea: Add an opt-in option to prevent useKeys from losing track of keyup.

## 6.2.0

### Minor Changes

- 11d5b33a: add useResizeObserverRef hook

## 6.1.0

### Minor Changes

- 33f6630d: add useAsyncEffect and useRenderCount hooks

## 6.0.1

### Major Changes

- 8b98cf06: useLocalstorage, useSessionstorage, useTimeout, useInterval, usePrevious, useVisibilitySensor, useUpdateEffect hooks removed. Please use useLocalstorageState, useSessionstorageState, useTimeoutWhen, useIntervalWhen, usePreviousImmediate, useInViewRef and useDidUpdate

## 6.0.0-alpha.0

### Major Changes

- a9d4e0af: useLocalstorage, useSessionstorage, useTimeout, useInterval, usePrevious, useVisibilitySensor, useUpdateEffect hooks removed. Please use useLocalstorageState, useSessionstorageState, useTimeoutWhen, useIntervalWhen, usePreviousImmediate, useInViewRef and useDidUpdate
