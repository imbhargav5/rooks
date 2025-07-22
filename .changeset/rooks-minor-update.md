---
"rooks": minor
---

## New Features and Improvements

### New Hooks
- Add experimental `useSuspenseNavigatorUserAgentData` hook for enhanced user agent detection capabilities

### Bug Fixes and Enhancements
- Fix `useWebLocksApi` hook to prevent combining its internal `signal` with the `ifAvailable` parameter, improving API reliability
- Refactor `useWindowSize` hook for improved clarity and performance with additional tests
- Enhance `useAudio` hook documentation for better clarity and examples

### Documentation Improvements
- Update README image source to local path for better reliability
- Refactor hooks list with improved categorization and markdown structure
- Comprehensive documentation updates for multiple hooks including:
  - `useUndoRedoState` with API details and examples
  - `useSetState` with comprehensive examples and details
  - `useRenderCount` with use cases and examples
  - `useOnClickRef` with detailed explanations
  - `useDeepCompareEffect` with usage guide
  - `useOnHoverRef` with comprehensive examples
  - `useWhyDidYouUpdate` with detailed documentation
  - `useSafeSetState` with detailed explanations
  - `useSessionstorageState` with comprehensive examples
  - `useDebounceFn` with detailed explanations
- Fix markdown code formatting in hook documentation tables
- Add `lucide-react` dependency and update icon handling

### Developer Experience
- Improved code formatting and structure across multiple hook documentations
- Enhanced examples and use cases for better developer understanding
- Better categorization and organization of hooks documentation
