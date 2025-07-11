# Rooks

Rooks is a collection of essential React custom hooks. It aims to supercharge React components by providing a set of reusable and well-tested hooks.

## Project Overview

- **Description:** A library of React custom hooks.
- **Website:** https://rooks.vercel.app
- **Key Technologies:** React, TypeScript, pnpm, turbo, changesets
- **Source Code:** https://github.com/imbhargav5/rooks

## Key Commands

**Note:** This is a monorepo that uses Turborepo to manage scripts. All commands should be run from the root of the project. Turborepo will automatically run the scripts in the appropriate packages.

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the development server.
- `pnpm build`: Build the project.
- `pnpm test`: Run tests.
- `pnpm lint`: Lint the codebase.
- `pnpm create`: Create a new hook. This is an interactive script that will prompt you for information about the new hook.

  **Example Usage:**

  When you run `pnpm create`, you will be asked a series of questions:

  ```bash
  ? Name of the package in hyphen separated words starting with use.For eg: use-regina-phalange (use-r)
  ? Name of the hook which will be used for it's javascript import etc. For eg: useReginaPhalange (useR)
  ? Description of the hook.
  ? Category of the hook (Use arrow keys)
  ❯ ui
    misc
    state
    effects
    navigator
    form
    events
  ```

  After answering the questions, the script will automatically create the following files:
    - `packages/rooks/src/hooks/useNewHook.ts`
    - `packages/rooks/src/__tests__/useNewHook.spec.ts`
    - `apps/website/content/docs/hooks/useNewHook.mdx`
- `pnpm changeset`: Create a new changeset for a release.
- `pnpm release`: Publish a new release.

## Project Structure

- `apps/website`: The documentation website for the hooks.
- `packages/rooks`: The main package containing all the hooks.
- `packages/eslint-config`: ESLint configuration for the project.
- `packages/typescript-config`: TypeScript configuration for the project.
- `scripts`: Various scripts for automating tasks.
- `data/docs`: Markdown files for the documentation of each hook.

## Hooks

The hooks are organized into the following categories:

### State

- `useArrayState`
- `useCounter`
- `useLocalstorageState`
- `useMapState`
- `useNativeMapState`
- `useQueueState`
- `useSelect`
- `useSelectableList`
- `useSessionstorageState`
- `useSetState`
- `useStackState`
- `useTimeTravelState`
- `useToggle`
- `useUndoRedoState`
- `useUndoState`

### Effects

- `useAsyncEffect`
- `useDeepCompareEffect`
- `useDidMount`
- `useDidUpdate`
- `useEffectOnceWhen`
- `useIntervalWhen`
- `useIsomorphicEffect`
- `useLifecycleLogger`
- `useWillUnmount`

### Events

- `useDocumentEventListener`
- `useDocumentVisibilityState`
- `useFocus`
- `useFocusWithin`
- `useIsDroppingFiles`
- `useOnClickRef`
- `useOnHoverRef`
- `useOnLongHover`
- `useOnLongPress`
- `useOnWindowResize`
- `useOnWindowScroll`
- `useOutsideClick`
- `useOutsideClickRef`
- `useWindowEventListener`

### UI

- `useAudio`
- `useBoundingclientrect`
- `useBoundingclientrectRef`
- `useDimensionsRef`
- `useFullscreen`
- `useGeolocation`
- `useInViewRef`
- `useIntersectionObserverRef`
- `useKey`
- `useKeyBindings`
- `useKeyRef`
- `useKeys`
- `useMediaMatch`
- `useMouse`
- `useMutationObserver`
- `useMutationObserverRef`
- `useRaf`
- `useResizeObserverRef`
- `useVideo`
- `useWindowScrollPosition`
- `useWindowSize`

### Misc

- `useDebounce`
- `useDebouncedValue`
- `useDebounceFn`
- `useForkRef`
- `useFreshCallback`
- `useFreshRef`
- `useFreshTick`
- `useMergeRefs`
- `useOrientation`
- `usePreviousDifferent`
- `usePreviousImmediate`
- `usePromise`
- `useRenderCount`
- `useSafeSetState`
- `useSpeech`
- `useThrottle`
- `useTimeoutWhen`
- `useVibrate`
- `useWhyDidYouUpdate`

### Form

- `useFileDropRef`
- `useInput`

### Navigator

- `useNavigatorLanguage`
- `useOnline`

### Future Hooks

Here are some ideas for new hooks that could be added to the collection:

- **Animation:**
    - `useTween`: A hook for creating tween animations.
    - `useSpring`: A hook for creating spring animations.
    - `useAnimation`: A hook for creating complex animations with a timeline.
- **Sensors:**
    - `useDeviceMotion`: A hook for tracking device motion.
    - `useDeviceOrientation`: A hook for tracking device orientation.
    - `useBattery`: A hook for getting battery status.
- **Network:**
    - `useFetch`: A hook for making fetch requests.
    - `useWebSocket`: A hook for working with WebSockets.
    - `useSSE`: A hook for working with Server-Sent Events.
- **Accessibility:**
    - `useAnnounce`: A hook for making screen reader announcements.
    - `useFocusTrap`: A hook for trapping focus within an element.
    - `useReducedMotion`: A hook for checking if the user has requested reduced motion.
- **Misc:**
    - `useClipboard`: A hook for copying text to the clipboard.
    - `useCookie`: A hook for getting and setting cookies.
    - `useIdleDetectionApi`: A hook for detecting when the user is idle using Idle Detection API with polyfill.
    - `useScript`: A hook for dynamically loading scripts.
    - `useFavicon`: A hook for changing the favicon.

## TypeScript Writing Style

The project enforces a high level of type safety. The TypeScript configuration has `strict` and `noUncheckedIndexedAccess` set to `true`. This means that we should avoid using `any` and be explicit with our types.

### Anatomy of a React Hook

A typical hook in this project has the following structure:

1.  **Type Definition:** A `type` or `interface` is defined for the return value of the hook.
2.  **JSDoc:** A JSDoc comment that explains what the hook does, its parameters, and what it returns. It also includes a link to the documentation website.
3.  **Hook Function:** The hook function itself, which is a regular function that starts with `use`.
4.  **Export:** The hook is exported from the file.

Here is an example of the `useCounter` hook:

```typescript
import { useCallback, useState } from "react";

type CounterHandler = {
  decrement: () => void;
  decrementBy: (amount: number) => void;
  increment: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
  value: number;
};

/**
 * @typedef handler
 * @type {object}
 * @property {number} value The value of the counter
 * @property {Function}  increment Increment counter value by 1
 * @property {Function} decrement Decrement counter value by 1
 * @property {Function} incrementBy Increment counter by incrAmount
 * @property {Function} decrementBy Decrement counter by decrAmount
 * @property {Function} reset Reset counter to initialValue
 * @see {@link https://rooks.vercel.app/docs/useCounter}
 */

/**
 * Counter hook
 *
 * @param {number} initialValue The initial value of the counter
 * @returns {handler} A handler to interact with the counter
 * @see https://rooks.vercel.app/docs/useCounter
 */
function useCounter(initialValue: number): CounterHandler {
  const [counter, setCounter] = useState(initialValue);
  /**
   * Increment counter by an amount
   *
   * @param {number} incrAmount
   */
  const incrementBy = useCallback((incrAmount: number) => {
    setCounter((currentCounter) => currentCounter + incrAmount);
  }, []);
  /**
   *
   * Decrement counter by an amount
   *
   * @param {*} decrAmount
   */
  const decrementBy = useCallback(
    (decrAmount: number) => {
      incrementBy(-decrAmount);
    },
    [incrementBy]
  );

  /**
   * Increment counter by 1
   */
  const increment = useCallback(() => {
    incrementBy(1);
  }, [incrementBy]);
  /**
   * Decrement counter by 1
   */
  const decrement = useCallback(() => {
    incrementBy(-1);
  }, [incrementBy]);
  /**
   * Reset counter to initial value
   */
  const reset = useCallback(() => {
    setCounter(initialValue);
  }, [initialValue]);

  return {
    decrement,
    decrementBy,
    increment,
    incrementBy,
    reset,
    value: counter,
  };
}

export { useCounter };
```

### Avoiding `any`

To avoid using `any`, we should use generics when possible. For example, if a hook can work with any type of value, we can use a generic type parameter.

```typescript
function useMyHook<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  // ...
}
```
