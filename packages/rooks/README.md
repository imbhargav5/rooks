<p align="center">
  <img src="https://i.ibb.co/KpJRdjvj/rooks-graphic.png" alt="Rooks: a collection of React hooks" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/imbhargav5/rooks/actions/workflows/ci-release.yml"><img src="https://img.shields.io/github/actions/workflow/status/imbhargav5/rooks/ci-release.yml?style=for-the-badge&logo=github&label=CI" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/rooks"><img src="https://img.shields.io/npm/v/rooks?style=for-the-badge&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/rooks"><img src="https://img.shields.io/bundlephobia/minzip/rooks?style=for-the-badge&logo=webpack&label=size" alt="bundle size" /></a>
  <a href="https://codecov.io/gh/imbhargav5/rooks"><img src="https://img.shields.io/codecov/c/github/imbhargav5/rooks/main?style=for-the-badge&logo=codecov" alt="coverage" /></a>
  <a href="https://github.com/imbhargav5/rooks/blob/main/LICENSE"><img src="https://img.shields.io/github/license/imbhargav5/rooks?style=for-the-badge" alt="license" /></a>
</p>

<h1 align="center">Rooks</h1>

<p align="center">
  Focused, tree-shakeable, TypeScript-first React hooks for application state, browser APIs, events, timing, and UI behavior.
</p>

<p align="center">
  <a href="https://rooks.vercel.app/docs">Documentation</a> ·
  <a href="https://rooks.vercel.app/docs/getting-started">Getting started</a> ·
  <a href="https://rooks.vercel.app/docs/hooks">Hook reference</a> ·
  <a href="https://github.com/imbhargav5/rooks/blob/main/CONTRIBUTING.md">Contributing</a>
</p>

## Install

```bash
pnpm add rooks
```

Rooks supports React and React DOM 18 or 19. The package is ESM-only.

## Quick start

```tsx
import { useCounter } from "rooks";

export function Counter() {
  const { value, increment, decrement, reset } = useCounter(0);

  return (
    <section>
      <p>Count: {value}</p>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
}
```

Continue with the [three-step tutorial](https://rooks.vercel.app/docs/getting-started), or browse the [hook index](https://rooks.vercel.app/docs/hooks).

## Entrypoints

Rooks separates stable hooks, experimental hooks, and Temporal hooks so applications only opt into the compatibility and dependency surface they need.

| Import path          | Use it for                                                    | Stability                                                        |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| `rooks`              | Stable hooks and explicitly exported utility types            | Stable                                                           |
| `rooks/experimental` | Hooks whose API or behavior may change between minor releases | Experimental                                                     |
| `rooks/temporal`     | Hooks built on the JavaScript Temporal API                    | Stable, optional polyfill required where Temporal is unavailable |

### Stable hooks

```tsx
import { useToggle } from "rooks";
```

Only types exported by an entrypoint are importable. Option and result shapes shown inline in a hook page are not necessarily public named exports.

### Experimental hooks

```tsx
import { useWebSocket } from "rooks/experimental";
```

Experimental hooks are isolated from the main entrypoint and can change in a minor release. Read the [experimental hooks guide](https://rooks.vercel.app/docs/guides/experimental-hooks) before using them in production.

### Temporal hooks

Install the optional polyfill when your supported runtimes do not provide `Temporal`:

```bash
pnpm add @js-temporal/polyfill
```

```tsx
import { useTemporalNow } from "rooks/temporal";

export function Clock() {
  const now = useTemporalNow({ precision: "second" });

  return <time>{now?.toString() ?? "Loading time…"}</time>;
}
```

Temporal hooks require BigInt support and have specific SSR and time-zone considerations. See the [Temporal hooks guide](https://rooks.vercel.app/docs/guides/temporal-hooks).

## Server rendering and browser APIs

Hooks that read browser globals handle server rendering in hook-specific ways. Components still need a client boundary in frameworks where hooks cannot run in server components, and permission-gated APIs need a fallback for unsupported or denied states.

Read [SSR and browser APIs](https://rooks.vercel.app/docs/guides/ssr-and-browser-apis) before using browser-only hooks in a server-rendered application.

## Hook catalog

The following counts and tables are generated from the package export barrels and the canonical MDX pages. Run `pnpm docs:generate` after adding or moving a public hook; CI verifies the zone with `pnpm docs:generate --check`.

<!--hookslist start-->

<!-- Generated by `pnpm docs:generate`. Do not edit this zone by hand. -->

**147 canonical hook implementations** are available across three entrypoints. Aliases are listed separately and do not inflate this count.

| Entrypoint           | Canonical hooks |
| -------------------- | --------------: |
| `rooks`              |             118 |
| `rooks/experimental` |              25 |
| `rooks/temporal`     |               4 |

<details>
<summary><strong>Animation & Timing (10)</strong></summary>

| Hook                                                                                     | Description                                                                 | Entrypoint |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- |
| [`useAnimation`](https://rooks.vercel.app/docs/hooks/useAnimation)                       | Deprecated progress animation hook; use useEasing for new code.             | `rooks`    |
| [`useEasing`](https://rooks.vercel.app/docs/hooks/useEasing)                             | Creates a controllable eased animation progress value.                      | `rooks`    |
| [`useIntervalWhen`](https://rooks.vercel.app/docs/hooks/useIntervalWhen)                 | Runs the latest callback on an interval while a condition is true.          | `rooks`    |
| [`useLockBodyScroll`](https://rooks.vercel.app/docs/hooks/useLockBodyScroll)             | Sets document.body overflow to hidden while a condition is true.            | `rooks`    |
| [`usePrefersReducedMotion`](https://rooks.vercel.app/docs/hooks/usePrefersReducedMotion) | Tracks the user's prefers-reduced-motion media setting.                     | `rooks`    |
| [`useRaf`](https://rooks.vercel.app/docs/hooks/useRaf)                                   | Runs the latest callback every animation frame while active.                | `rooks`    |
| [`useResizeObserverRef`](https://rooks.vercel.app/docs/hooks/useResizeObserverRef)       | Observes the size of the element attached to a callback ref.                | `rooks`    |
| [`useSpring`](https://rooks.vercel.app/docs/hooks/useSpring)                             | Animates a number toward a target with a basic damped spring simulation.    | `rooks`    |
| [`useTimeoutWhen`](https://rooks.vercel.app/docs/hooks/useTimeoutWhen)                   | Runs the latest callback once after a delay while a condition remains true. | `rooks`    |
| [`useTween`](https://rooks.vercel.app/docs/hooks/useTween)                               | Animates an eased progress value from zero to one.                          | `rooks`    |

</details>

<details>
<summary><strong>Browser APIs (16)</strong></summary>

| Hook                                                                                 | Description                                                                                      | Entrypoint |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ---------- |
| [`useBroadcastChannel`](https://rooks.vercel.app/docs/hooks/useBroadcastChannel)     | Enables cross-tab/window communication via the BroadcastChannel API.                             | `rooks`    |
| [`useClipboard`](https://rooks.vercel.app/docs/hooks/useClipboard)                   | Reads from and writes to the clipboard using the Clipboard API.                                  | `rooks`    |
| [`useFetch`](https://rooks.vercel.app/docs/hooks/useFetch)                           | Hook for fetching data from URLs with loading states, error handling, and automatic JSON parsing | `rooks`    |
| [`useGeolocation`](https://rooks.vercel.app/docs/hooks/useGeolocation)               | Tracks the user's geographic location using the Geolocation API.                                 | `rooks`    |
| [`useIdleDetectionApi`](https://rooks.vercel.app/docs/hooks/useIdleDetectionApi)     | Detects when the user is idle using the IdleDetection API.                                       | `rooks`    |
| [`useMediaRecorder`](https://rooks.vercel.app/docs/hooks/useMediaRecorder)           | Records audio/video streams using the MediaRecorder API.                                         | `rooks`    |
| [`useNavigatorLanguage`](https://rooks.vercel.app/docs/hooks/useNavigatorLanguage)   | Returns the user's preferred language from the Navigator API.                                    | `rooks`    |
| [`useNetworkInformation`](https://rooks.vercel.app/docs/hooks/useNetworkInformation) | Exposes network connectivity and speed information from the Network Information API.             | `rooks`    |
| [`useNotification`](https://rooks.vercel.app/docs/hooks/useNotification)             | Requests permission and sends desktop notifications via the Notifications API.                   | `rooks`    |
| [`useOnline`](https://rooks.vercel.app/docs/hooks/useOnline)                         | Tracks the browser's navigator.onLine connectivity hint.                                         | `rooks`    |
| [`useOrientation`](https://rooks.vercel.app/docs/hooks/useOrientation)               | Returns the current screen orientation and listens for orientation changes.                      | `rooks`    |
| [`useScreenDetailsApi`](https://rooks.vercel.app/docs/hooks/useScreenDetailsApi)     | Provides details about the user's screens using the Screen Details API.                          | `rooks`    |
| [`useShare`](https://rooks.vercel.app/docs/hooks/useShare)                           | Triggers the native Web Share dialog to share content from the browser.                          | `rooks`    |
| [`useSpeech`](https://rooks.vercel.app/docs/hooks/useSpeech)                         | Converts text to speech using the Web Speech API.                                                | `rooks`    |
| [`useVibrate`](https://rooks.vercel.app/docs/hooks/useVibrate)                       | Triggers device vibration patterns using the Vibration API.                                      | `rooks`    |
| [`useWebLocksApi`](https://rooks.vercel.app/docs/hooks/useWebLocksApi)               | Coordinates asynchronous resource access using the Web Locks API.                                | `rooks`    |

</details>

<details>
<summary><strong>Development & Debugging (2)</strong></summary>

| Hook                                                                           | Description                                                           | Entrypoint |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ---------- |
| [`useRenderCount`](https://rooks.vercel.app/docs/hooks/useRenderCount)         | Counts how many times the current hook instance has rendered.         | `rooks`    |
| [`useWhyDidYouUpdate`](https://rooks.vercel.app/docs/hooks/useWhyDidYouUpdate) | Logs tracked values whose identity changed between committed renders. | `rooks`    |

</details>

<details>
<summary><strong>Event Handling (17)</strong></summary>

| Hook                                                                                           | Description                                                                    | Entrypoint |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- |
| [`useDocumentEventListener`](https://rooks.vercel.app/docs/hooks/useDocumentEventListener)     | Attaches a document event listener and removes it when the component unmounts. | `rooks`    |
| [`useDocumentVisibilityState`](https://rooks.vercel.app/docs/hooks/useDocumentVisibilityState) | Returns the document visibility state and updates when it changes.             | `rooks`    |
| [`useFocus`](https://rooks.vercel.app/docs/hooks/useFocus)                                     | Provides focus and blur props for an element's own focus boundary.             | `rooks`    |
| [`useFocusWithin`](https://rooks.vercel.app/docs/hooks/useFocusWithin)                         | Provides focus props that track entry to and exit from an element subtree.     | `rooks`    |
| [`useIsDroppingFiles`](https://rooks.vercel.app/docs/hooks/useIsDroppingFiles)                 | Reports whether files are being dragged over an element or the window.         | `rooks`    |
| [`useOnClickRef`](https://rooks.vercel.app/docs/hooks/useOnClickRef)                           | Returns a ref that handles native click and touch-end events.                  | `rooks`    |
| [`useOnHoverRef`](https://rooks.vercel.app/docs/hooks/useOnHoverRef)                           | Returns a ref that handles native mouse-enter and mouse-leave events.          | `rooks`    |
| [`useOnLongHover`](https://rooks.vercel.app/docs/hooks/useOnLongHover)                         | Calls a callback after an element remains hovered for a duration.              | `rooks`    |
| [`useOnLongPress`](https://rooks.vercel.app/docs/hooks/useOnLongPress)                         | Calls a callback after an element remains pressed for a duration.              | `rooks`    |
| [`useOnStartTyping`](https://rooks.vercel.app/docs/hooks/useOnStartTyping)                     | Calls a callback for allowed typing keys outside editable elements.            | `rooks`    |
| [`useOnWindowResize`](https://rooks.vercel.app/docs/hooks/useOnWindowResize)                   | Calls a callback for passive window resize events.                             | `rooks`    |
| [`useOnWindowScroll`](https://rooks.vercel.app/docs/hooks/useOnWindowScroll)                   | Calls a callback for passive window scroll events.                             | `rooks`    |
| [`useOutsideClick`](https://rooks.vercel.app/docs/hooks/useOutsideClick)                       | Calls a handler for click or touch-start events outside an object ref.         | `rooks`    |
| [`useOutsideClickRef`](https://rooks.vercel.app/docs/hooks/useOutsideClickRef)                 | Returns a ref and calls a handler for click or touch-start events outside it.  | `rooks`    |
| [`usePageLeave`](https://rooks.vercel.app/docs/hooks/usePageLeave)                             | Calls a callback for unload, page-hide, and hidden-document signals.           | `rooks`    |
| [`useTextSelection`](https://rooks.vercel.app/docs/hooks/useTextSelection)                     | Returns the current text selection for the document or a target element.       | `rooks`    |
| [`useWindowEventListener`](https://rooks.vercel.app/docs/hooks/useWindowEventListener)         | Attaches a window event listener and removes it when the component unmounts.   | `rooks`    |

</details>

<details>
<summary><strong>Experimental Hooks (25)</strong></summary>

| Hook                                                                                                         | Description                                                                                    | Entrypoint           |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| [`useAsyncDisposable`](https://rooks.vercel.app/docs/hooks/useAsyncDisposable)                               | Manages async disposable resources using the TC39 Explicit Resource Management proposal.       | `rooks/experimental` |
| [`useBeforeUnload`](https://rooks.vercel.app/docs/hooks/useBeforeUnload)                                     | Prompt before the page unloads when a guard passes.                                            | `rooks/experimental` |
| [`useBrowserCookieState`](https://rooks.vercel.app/docs/hooks/useBrowserCookieState)                         | Persist React state in browser cookies with same-document synchronization.                     | `rooks/experimental` |
| [`useDisposable`](https://rooks.vercel.app/docs/hooks/useDisposable)                                         | Manages synchronous disposable resources using the TC39 Explicit Resource Management proposal. | `rooks/experimental` |
| [`useEventListener`](https://rooks.vercel.app/docs/hooks/useEventListener)                                   | Strongly typed event-listener primitive for browser EventTargets.                              | `rooks/experimental` |
| [`useIsClient`](https://rooks.vercel.app/docs/hooks/useIsClient)                                             | Tell whether the component has mounted on the client.                                          | `rooks/experimental` |
| [`useKeyPress`](https://rooks.vercel.app/docs/hooks/useKeyPress)                                             | Track whether one or more keyboard keys are currently pressed.                                 | `rooks/experimental` |
| [`useLocationHash`](https://rooks.vercel.app/docs/hooks/useLocationHash)                                     | Read the current location hash, including the leading #.                                       | `rooks/experimental` |
| [`useLocationSearchParam`](https://rooks.vercel.app/docs/hooks/useLocationSearchParam)                       | Read the first value for a specific search parameter.                                          | `rooks/experimental` |
| [`useLocationSnapshot`](https://rooks.vercel.app/docs/hooks/useLocationSnapshot)                             | Read the current browser location as a stable snapshot.                                        | `rooks/experimental` |
| [`useMediaDevices`](https://rooks.vercel.app/docs/hooks/useMediaDevices)                                     | Enumerate and refresh available media input and output devices.                                | `rooks/experimental` |
| [`usePermission`](https://rooks.vercel.app/docs/hooks/usePermission)                                         | Query and optionally watch browser permission state.                                           | `rooks/experimental` |
| [`useRequest`](https://rooks.vercel.app/docs/hooks/useRequest)                                               | Generic promise-request lifecycle hook with retries, polling, and mutation.                    | `rooks/experimental` |
| [`useResponsive`](https://rooks.vercel.app/docs/hooks/useResponsive)                                         | Track a named set of media queries and compute the current breakpoint.                         | `rooks/experimental` |
| [`useScript`](https://rooks.vercel.app/docs/hooks/useScript)                                                 | Load and share external script state across multiple consumers.                                | `rooks/experimental` |
| [`useScroll`](https://rooks.vercel.app/docs/hooks/useScroll)                                                 | Track an element's scroll offsets and scrollable bounds.                                       | `rooks/experimental` |
| [`useSize`](https://rooks.vercel.app/docs/hooks/useSize)                                                     | Measure an element with ResizeObserver using a callback ref.                                   | `rooks/experimental` |
| [`useSuspenseFavicon`](https://rooks.vercel.app/docs/hooks/useSuspenseFavicon)                               | Loads a favicon and suspends the component until the resource is ready.                        | `rooks/experimental` |
| [`useSuspenseIndexedDBState`](https://rooks.vercel.app/docs/hooks/useSuspenseIndexedDBState)                 | Reads and writes IndexedDB state with Suspense support.                                        | `rooks/experimental` |
| [`useSuspenseLocalStorageState`](https://rooks.vercel.app/docs/hooks/useSuspenseLocalStorageState)           | Reads and writes localStorage state with Suspense support.                                     | `rooks/experimental` |
| [`useSuspenseNavigatorBattery`](https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorBattery)             | Reads battery status from the Battery API with Suspense support.                               | `rooks/experimental` |
| [`useSuspenseNavigatorUserAgentData`](https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorUserAgentData) | Reads User-Agent Client Hints with Suspense support.                                           | `rooks/experimental` |
| [`useSuspenseSessionStorageState`](https://rooks.vercel.app/docs/hooks/useSuspenseSessionStorageState)       | Reads and writes sessionStorage state with Suspense support.                                   | `rooks/experimental` |
| [`useVirtualList`](https://rooks.vercel.app/docs/hooks/useVirtualList)                                       | Render a fixed-size virtual list with ready-to-use item styles.                                | `rooks/experimental` |
| [`useWebSocket`](https://rooks.vercel.app/docs/hooks/useWebSocket)                                           | Manage a WebSocket connection with parsing, sending, and reconnection helpers.                 | `rooks/experimental` |

</details>

<details>
<summary><strong>Form & File Handling (3)</strong></summary>

| Hook                                                                                 | Description                                                                         | Entrypoint |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| [`useCheckboxInputState`](https://rooks.vercel.app/docs/hooks/useCheckboxInputState) | Returns controlled checkbox state, handlers, and input props.                       | `rooks`    |
| [`useFileDropRef`](https://rooks.vercel.app/docs/hooks/useFileDropRef)               | Returns a ref that validates dropped files and reports accepted and rejected files. | `rooks`    |
| [`useFormState`](https://rooks.vercel.app/docs/hooks/useFormState)                   | Manages named form values, validation, touched state, and submission.               | `rooks`    |

</details>

<details>
<summary><strong>Keyboard & Input (5)</strong></summary>

| Hook                                                                   | Description                                                                 | Entrypoint |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- |
| [`useInput`](https://rooks.vercel.app/docs/hooks/useInput)             | Returns controlled input value and change props with optional validation.   | `rooks`    |
| [`useKey`](https://rooks.vercel.app/docs/hooks/useKey)                 | Calls a callback when any configured keyboard identifier matches an event.  | `rooks`    |
| [`useKeyBindings`](https://rooks.vercel.app/docs/hooks/useKeyBindings) | Maps independent keyboard identifiers to their callbacks.                   | `rooks`    |
| [`useKeyRef`](https://rooks.vercel.app/docs/hooks/useKeyRef)           | Returns a callback ref that handles matching keyboard events on an element. | `rooks`    |
| [`useKeys`](https://rooks.vercel.app/docs/hooks/useKeys)               | Calls a callback when every key in a configured combination is pressed.     | `rooks`    |

</details>

<details>
<summary><strong>Lifecycle & Effects (11)</strong></summary>

| Hook                                                                                     | Description                                                                         | Entrypoint |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| [`useAsyncEffect`](https://rooks.vercel.app/docs/hooks/useAsyncEffect)                   | Runs asynchronous effect work with a current-generation guard and optional cleanup. | `rooks`    |
| [`useDebouncedAsyncEffect`](https://rooks.vercel.app/docs/hooks/useDebouncedAsyncEffect) | Starts only the latest asynchronous effect after a debounce window.                 | `rooks`    |
| [`useDebouncedEffect`](https://rooks.vercel.app/docs/hooks/useDebouncedEffect)           | Delays an effect until its dependencies stop changing.                              | `rooks`    |
| [`useDeepCompareEffect`](https://rooks.vercel.app/docs/hooks/useDeepCompareEffect)       | Runs an effect when a dependency array changes by deep equality.                    | `rooks`    |
| [`useDidMount`](https://rooks.vercel.app/docs/hooks/useDidMount)                         | Runs a callback from an effect when a component mounts.                             | `rooks`    |
| [`useDidUpdate`](https://rooks.vercel.app/docs/hooks/useDidUpdate)                       | Runs a callback after updates while skipping the initial mount.                     | `rooks`    |
| [`useDocumentTitle`](https://rooks.vercel.app/docs/hooks/useDocumentTitle)               | Updates document.title and can restore its original value during cleanup.           | `rooks`    |
| [`useEffectOnceWhen`](https://rooks.vercel.app/docs/hooks/useEffectOnceWhen)             | Runs the latest callback once when a condition first becomes true.                  | `rooks`    |
| [`useIsomorphicEffect`](https://rooks.vercel.app/docs/hooks/useIsomorphicEffect)         | Uses a layout effect in the browser and a passive effect during server rendering.   | `rooks`    |
| [`useLifecycleLogger`](https://rooks.vercel.app/docs/hooks/useLifecycleLogger)           | Logs a component's mount, update, and unmount lifecycle to the console.             | `rooks`    |
| [`useWillUnmount`](https://rooks.vercel.app/docs/hooks/useWillUnmount)                   | Runs the initial callback as an effect cleanup when a component unmounts.           | `rooks`    |

</details>

<details>
<summary><strong>Mouse & Touch (3)</strong></summary>

| Hook                                                                           | Description                                                                  | Entrypoint |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------- |
| [`useMouse`](https://rooks.vercel.app/docs/hooks/useMouse)                     | Returns document-level mouse coordinates from the latest mousemove event.    | `rooks`    |
| [`useMouseMoveDelta`](https://rooks.vercel.app/docs/hooks/useMouseMoveDelta)   | Returns movement and velocity between consecutive document mousemove events. | `rooks`    |
| [`useMouseWheelDelta`](https://rooks.vercel.app/docs/hooks/useMouseWheelDelta) | Returns vertical wheel delta and velocity from document wheel events.        | `rooks`    |

</details>

<details>
<summary><strong>Performance & Optimization (5)</strong></summary>

| Hook                                                                         | Description                                                                     | Entrypoint |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- |
| [`useDebounce`](https://rooks.vercel.app/docs/hooks/useDebounce)             | Returns a stable Lodash-style debounced wrapper around the latest callback.     | `rooks`    |
| [`useDebouncedValue`](https://rooks.vercel.app/docs/hooks/useDebouncedValue) | Returns a value that follows its input after a delay, plus an immediate setter. | `rooks`    |
| [`useDebounceFn`](https://rooks.vercel.app/docs/hooks/useDebounceFn)         | Debounces a callback and reports whether its timeout window is active.          | `rooks`    |
| [`useThrottle`](https://rooks.vercel.app/docs/hooks/useThrottle)             | Executes a callback immediately at most once per timeout window.                | `rooks`    |
| [`useWebWorker`](https://rooks.vercel.app/docs/hooks/useWebWorker)           | Creates and manages a classic Web Worker with message, status, and error state. | `rooks`    |

</details>

<details>
<summary><strong>State Management (19)</strong></summary>

| Hook                                                                                   | Description                                                                            | Entrypoint |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| [`useArrayState`](https://rooks.vercel.app/docs/hooks/useArrayState)                   | Manages an array state with helper methods for push, pop, splice, sort, and more.      | `rooks`    |
| [`useCountdown`](https://rooks.vercel.app/docs/hooks/useCountdown)                     | Counts the intervals remaining until a target Date and reports progress or completion. | `rooks`    |
| [`useCounter`](https://rooks.vercel.app/docs/hooks/useCounter)                         | Manages a numeric counter with increment, decrement, and reset operations.             | `rooks`    |
| [`useGetIsMounted`](https://rooks.vercel.app/docs/hooks/useGetIsMounted)               | Returns a function that reports whether the component is currently mounted.            | `rooks`    |
| [`useLocalstorageState`](https://rooks.vercel.app/docs/hooks/useLocalstorageState)     | Persists React state in localStorage and synchronizes matching hook instances.         | `rooks`    |
| [`useMapState`](https://rooks.vercel.app/docs/hooks/useMapState)                       | Manages a record-like object as React state with keyed update and removal helpers.     | `rooks`    |
| [`useMultiSelectableList`](https://rooks.vercel.app/docs/hooks/useMultiSelectableList) | Manages multiple-selection list state with toggle and select-all helpers.              | `rooks`    |
| [`useNativeMapState`](https://rooks.vercel.app/docs/hooks/useNativeMapState)           | Manages a native Map object in React state with reactive update helpers.               | `rooks`    |
| [`usePreviousDifferent`](https://rooks.vercel.app/docs/hooks/usePreviousDifferent)     | Returns the most recent previous value that was different from the current one.        | `rooks`    |
| [`usePreviousImmediate`](https://rooks.vercel.app/docs/hooks/usePreviousImmediate)     | Returns the previous value of a variable immediately after it changes.                 | `rooks`    |
| [`usePromise`](https://rooks.vercel.app/docs/hooks/usePromise)                         | Tracks the status and result of a Promise (pending, resolved, or rejected).            | `rooks`    |
| [`useQueueState`](https://rooks.vercel.app/docs/hooks/useQueueState)                   | Manages queue (FIFO) state with enqueue, dequeue, and peek operations.                 | `rooks`    |
| [`useRafState`](https://rooks.vercel.app/docs/hooks/useRafState)                       | Updates React state on each requestAnimationFrame tick.                                | `rooks`    |
| [`useSafeSetState`](https://rooks.vercel.app/docs/hooks/useSafeSetState)               | Calls setState only if the component is still mounted, preventing memory leaks.        | `rooks`    |
| [`useSelect`](https://rooks.vercel.app/docs/hooks/useSelect)                           | Manages a selection state from a list of options with helpers.                         | `rooks`    |
| [`useSelectableList`](https://rooks.vercel.app/docs/hooks/useSelectableList)           | Manages a single-selection list state with toggle and clear helpers.                   | `rooks`    |
| [`useSessionstorageState`](https://rooks.vercel.app/docs/hooks/useSessionstorageState) | Persists React state in sessionStorage and synchronizes matching hook instances.       | `rooks`    |
| [`useSetState`](https://rooks.vercel.app/docs/hooks/useSetState)                       | Manages a Set data structure as React state with add, delete, and clear helpers.       | `rooks`    |
| [`useStackState`](https://rooks.vercel.app/docs/hooks/useStackState)                   | Manages stack (LIFO) state with push, pop, and peek operations.                        | `rooks`    |

</details>

<details>
<summary><strong>State History & Time Travel (4)</strong></summary>

| Hook                                                                           | Description                                                                | Entrypoint |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------- |
| [`useTimeTravelState`](https://rooks.vercel.app/docs/hooks/useTimeTravelState) | Manages state with undo, redo, and navigation across its complete history. | `rooks`    |
| [`useToggle`](https://rooks.vercel.app/docs/hooks/useToggle)                   | Toggles a boolean or applies a custom reducer to another state type.       | `rooks`    |
| [`useUndoRedoState`](https://rooks.vercel.app/docs/hooks/useUndoRedoState)     | Manages state with bounded undo and redo history.                          | `rooks`    |
| [`useUndoState`](https://rooks.vercel.app/docs/hooks/useUndoState)             | Manages state with a bounded, one-directional undo history.                | `rooks`    |

</details>

<details>
<summary><strong>Temporal Hooks (4)</strong></summary>

| Hook                                                                               | Description                                                                          | Entrypoint       |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------- |
| [`useTemporalAge`](https://rooks.vercel.app/docs/hooks/useTemporalAge)             | Calculates calendar age from a date and updates at each local day boundary.          | `rooks/temporal` |
| [`useTemporalCountdown`](https://rooks.vercel.app/docs/hooks/useTemporalCountdown) | Counts down to a Temporal instant and stops when the target is reached.              | `rooks/temporal` |
| [`useTemporalElapsed`](https://rooks.vercel.app/docs/hooks/useTemporalElapsed)     | Measures elapsed time from an instant and updates on aligned boundaries.             | `rooks/temporal` |
| [`useTemporalNow`](https://rooks.vercel.app/docs/hooks/useTemporalNow)             | Returns the current time as a Temporal value and updates on aligned time boundaries. | `rooks/temporal` |

</details>

<details>
<summary><strong>UI & Layout (14)</strong></summary>

| Hook                                                                                           | Description                                                                                              | Entrypoint |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------- |
| [`useAudio`](https://rooks.vercel.app/docs/hooks/useAudio)                                     | Controls an audio element while exposing playback, loading, timing, volume, rate, loop, and error state. | `rooks`    |
| [`useBoundingclientrect`](https://rooks.vercel.app/docs/hooks/useBoundingclientrect)           | Reads an element's DOMRect after mount and whenever the observed DOM subtree mutates.                    | `rooks`    |
| [`useBoundingclientrectRef`](https://rooks.vercel.app/docs/hooks/useBoundingclientrectRef)     | Supplies a callback ref, its current DOMRect, and a manual measurement function.                         | `rooks`    |
| [`useDimensionsRef`](https://rooks.vercel.app/docs/hooks/useDimensionsRef)                     | Measures an attached div after layout and optionally on window resize and scroll.                        | `rooks`    |
| [`useFullscreen`](https://rooks.vercel.app/docs/hooks/useFullscreen)                           | Enters, exits, and tracks Fullscreen API state for the document or a target element.                     | `rooks`    |
| [`useIntersectionObserverRef`](https://rooks.vercel.app/docs/hooks/useIntersectionObserverRef) | Returns a callback ref that forwards IntersectionObserver notifications to the latest callback.          | `rooks`    |
| [`useInViewRef`](https://rooks.vercel.app/docs/hooks/useInViewRef)                             | Returns a callback ref and whether its element currently intersects an observer root.                    | `rooks`    |
| [`useMeasure`](https://rooks.vercel.app/docs/hooks/useMeasure)                                 | Measures client, offset, and scroll dimensions with ResizeObserver and optional debouncing.              | `rooks`    |
| [`useMediaMatch`](https://rooks.vercel.app/docs/hooks/useMediaMatch)                           | Subscribes to a CSS media query with a deterministic server-rendered fallback.                           | `rooks`    |
| [`useMutationObserver`](https://rooks.vercel.app/docs/hooks/useMutationObserver)               | Observes mutations on the element in an existing object ref and cleans up automatically.                 | `rooks`    |
| [`useMutationObserverRef`](https://rooks.vercel.app/docs/hooks/useMutationObserverRef)         | Returns a callback ref that observes DOM mutations on its current element.                               | `rooks`    |
| [`usePictureInPictureApi`](https://rooks.vercel.app/docs/hooks/usePictureInPictureApi)         | Detects, enters, exits, and tracks standard Picture-in-Picture state for a video element.                | `rooks`    |
| [`usePreferredColorScheme`](https://rooks.vercel.app/docs/hooks/usePreferredColorScheme)       | Tracks the user's light, dark, or no-preference color-scheme media setting.                              | `rooks`    |
| [`useVideo`](https://rooks.vercel.app/docs/hooks/useVideo)                                     | Supplies a video ref with playback, timing, mute, volume, seeking, and fullscreen controls.              | `rooks`    |

</details>

<details>
<summary><strong>Utilities & Refs (7)</strong></summary>

| Hook                                                                             | Description                                                                        | Entrypoint |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------- |
| [`useEventListenerRef`](https://rooks.vercel.app/docs/hooks/useEventListenerRef) | Returns a callback ref that manages an event listener on its current HTML element. | `rooks`    |
| [`useForkRef`](https://rooks.vercel.app/docs/hooks/useForkRef)                   | Sends one ref value to two mutable or callback refs.                               | `rooks`    |
| [`useFreshCallback`](https://rooks.vercel.app/docs/hooks/useFreshCallback)       | Returns a stable function that delegates to the latest callback after effects run. | `rooks`    |
| [`useFreshRef`](https://rooks.vercel.app/docs/hooks/useFreshRef)                 | Keeps the latest committed value in a stable mutable ref.                          | `rooks`    |
| [`useFreshTick`](https://rooks.vercel.app/docs/hooks/useFreshTick)               | Returns a function that invokes the latest void callback after effects run.        | `rooks`    |
| [`useMergeRefs`](https://rooks.vercel.app/docs/hooks/useMergeRefs)               | Sends one ref value to any number of mutable or callback refs.                     | `rooks`    |
| [`useRefElement`](https://rooks.vercel.app/docs/hooks/useRefElement)             | Exposes a callback ref together with the element currently attached to it.         | `rooks`    |

</details>

<details>
<summary><strong>Window & Viewport (2)</strong></summary>

| Hook                                                                                     | Description                                                         | Entrypoint |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| [`useWindowScrollPosition`](https://rooks.vercel.app/docs/hooks/useWindowScrollPosition) | Returns reactive horizontal and vertical window scroll coordinates. | `rooks`    |
| [`useWindowSize`](https://rooks.vercel.app/docs/hooks/useWindowSize)                     | Returns reactive inner and outer browser window dimensions.         | `rooks`    |

</details>

### Supported aliases

| Alias               | Canonical hook                                                         | Entrypoint |
| ------------------- | ---------------------------------------------------------------------- | ---------- |
| `useObjectState`    | [`useMapState`](https://rooks.vercel.app/docs/hooks/useMapState)       | `rooks`    |
| `useOnLongHoverRef` | [`useOnLongHover`](https://rooks.vercel.app/docs/hooks/useOnLongHover) | `rooks`    |
| `useOnLongPressRef` | [`useOnLongPress`](https://rooks.vercel.app/docs/hooks/useOnLongPress) | `rooks`    |

<!--hookslist end-->

## Documentation

- [Getting started](https://rooks.vercel.app/docs/getting-started)
- [Guides](https://rooks.vercel.app/docs/guides/ssr-and-browser-apis)
- [Hook reference](https://rooks.vercel.app/docs/hooks)
- [Entrypoints and compatibility](https://rooks.vercel.app/docs/reference/entrypoints-and-compatibility)
- [Design and stability](https://rooks.vercel.app/docs/explanation/design-and-stability)

Every hook page is hand-authored MDX under `apps/website/content/docs`. Import paths, aliases, status, signatures, and README catalog data are validated against the package barrels.

## Community

- Read [CONTRIBUTING.md](https://github.com/imbhargav5/rooks/blob/main/CONTRIBUTING.md) before proposing a change.
- Use [GitHub Discussions](https://github.com/imbhargav5/rooks/discussions) for usage questions.
- Follow [SUPPORT.md](https://github.com/imbhargav5/rooks/blob/main/SUPPORT.md) for bugs and feature proposals.
- Report vulnerabilities privately as described in [SECURITY.md](https://github.com/imbhargav5/rooks/blob/main/SECURITY.md).
- Maintainers should use the main-only [release runbook](https://github.com/imbhargav5/rooks/blob/main/MAINTENANCE.md).
- See the [changelog](https://github.com/imbhargav5/rooks/blob/main/packages/rooks/CHANGELOG.md) for release history.

## License

Rooks is available under the [MIT License](https://github.com/imbhargav5/rooks/blob/main/LICENSE).

## Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-84-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks to everyone who has contributed to Rooks. The historical acknowledgements below use the [All Contributors emoji key](https://allcontributors.org/en/reference/emoji-key/); the contributor graph above is the current record.

<details>
<summary><b>View historical acknowledgements</b></summary>

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://codewithbhargav.com/"><img src="https://avatars.githubusercontent.com/u/2936644?v=4?s=100" width="100px;" alt="Bhargav Ponnapalli"/><br /><sub><b>Bhargav Ponnapalli</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=imbhargav5" title="Code">💻</a> <a href="#maintenance-imbhargav5" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://simbathesailor.dev/"><img src="https://avatars.githubusercontent.com/u/5938110?v=4?s=100" width="100px;" alt="anil kumar chaudhary"/><br /><sub><b>anil kumar chaudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=simbathesailor" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/qiweiii"><img src="https://avatars.githubusercontent.com/u/32790369?v=4?s=100" width="100px;" alt="Qiwei Yang"/><br /><sub><b>Qiwei Yang</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=qiweiii" title="Code">💻</a> <a href="#maintenance-qiweiii" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/maciekgrzybek"><img src="https://avatars.githubusercontent.com/u/16546428?v=4?s=100" width="100px;" alt="maciek_grzybek"/><br /><sub><b>maciek_grzybek</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=maciekgrzybek" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://foobars.in/"><img src="https://avatars.githubusercontent.com/u/5774849?v=4?s=100" width="100px;" alt="Harsh Zalavadiya"/><br /><sub><b>Harsh Zalavadiya</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=harshzalavadiya" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mahijendra"><img src="https://avatars.githubusercontent.com/u/39908767?v=4?s=100" width="100px;" alt="B V K MAHIJENDRA "/><br /><sub><b>B V K MAHIJENDRA </b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mahijendra" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/braxtonchristensen"><img src="https://avatars.githubusercontent.com/u/11494223?v=4?s=100" width="100px;" alt="Braxton Christensen"/><br /><sub><b>Braxton Christensen</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=braxtonchristensen" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hanselabreu"><img src="https://avatars.githubusercontent.com/u/27902567?v=4?s=100" width="100px;" alt="Hansel"/><br /><sub><b>Hansel</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=hanselabreu" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/harshilparmar"><img src="https://avatars.githubusercontent.com/u/45915468?v=4?s=100" width="100px;" alt="Harshil Parmar"/><br /><sub><b>Harshil Parmar</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=harshilparmar" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://elrumordelaluz.com/"><img src="https://avatars.githubusercontent.com/u/784056?v=4?s=100" width="100px;" alt="Lionel"/><br /><sub><b>Lionel</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=elrumordelaluz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://mxstbr.com/"><img src="https://avatars.githubusercontent.com/u/7525670?v=4?s=100" width="100px;" alt="Max Stoiber"/><br /><sub><b>Max Stoiber</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mxstbr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mscottmoore"><img src="https://avatars.githubusercontent.com/u/5983927?v=4?s=100" width="100px;" alt="Michael Moore"/><br /><sub><b>Michael Moore</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mscottmoore" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ChocolateLoverRaj"><img src="https://avatars.githubusercontent.com/u/52586855?v=4?s=100" width="100px;" alt="Rajas Paranjpe"/><br /><sub><b>Rajas Paranjpe</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ChocolateLoverRaj" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://pka.netlify.app/"><img src="https://avatars.githubusercontent.com/u/31067376?v=4?s=100" width="100px;" alt="Mahendra Choudhary"/><br /><sub><b>Mahendra Choudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=iampika" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/phmngocnghia"><img src="https://avatars.githubusercontent.com/u/36730355?v=4?s=100" width="100px;" alt="Nghia Pham"/><br /><sub><b>Nghia Pham</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=phmngocnghia" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.twitter.com/deadcoder0904"><img src="https://avatars.githubusercontent.com/u/16436270?v=4?s=100" width="100px;" alt="Akshay Kadam (A2K)"/><br /><sub><b>Akshay Kadam (A2K)</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=deadcoder0904" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alex-golubtsov"><img src="https://avatars.githubusercontent.com/u/1982853?v=4?s=100" width="100px;" alt="Alex Golubtsov"/><br /><sub><b>Alex Golubtsov</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=alex-golubtsov" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Armanio"><img src="https://avatars.githubusercontent.com/u/3195714?v=4?s=100" width="100px;" alt="Arman"/><br /><sub><b>Arman</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=Armanio" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrvisser"><img src="https://avatars.githubusercontent.com/u/102265?v=4?s=100" width="100px;" alt="Branden Visser"/><br /><sub><b>Branden Visser</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mrvisser" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://3dgo.net/"><img src="https://avatars.githubusercontent.com/u/1618956?v=4?s=100" width="100px;" alt="Brian Steere"/><br /><sub><b>Brian Steere</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=Dianoga" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.calcourtney.net/"><img src="https://avatars.githubusercontent.com/u/30095183?v=4?s=100" width="100px;" alt="Cal Courtney"/><br /><sub><b>Cal Courtney</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=calthejuggler" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/chrismilson"><img src="https://avatars.githubusercontent.com/u/13655076?v=4?s=100" width="100px;" alt="Chris Milson"/><br /><sub><b>Chris Milson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=chrismilson" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://zhihu.com/people/dancerphil"><img src="https://avatars.githubusercontent.com/u/7264444?v=4?s=100" width="100px;" alt="Cong Zhang"/><br /><sub><b>Cong Zhang</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dancerphil" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://danielholmes.org/"><img src="https://avatars.githubusercontent.com/u/349833?v=4?s=100" width="100px;" alt="Daniel Holmes"/><br /><sub><b>Daniel Holmes</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=danielholmes" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/febeck"><img src="https://avatars.githubusercontent.com/u/12020091?v=4?s=100" width="100px;" alt="Fernando Beck"/><br /><sub><b>Fernando Beck</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=febeck" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshdavenport.co.uk/"><img src="https://avatars.githubusercontent.com/u/757828?v=4?s=100" width="100px;" alt="Josh Davenport"/><br /><sub><b>Josh Davenport</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=joshdavenport" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/1337MARCEL"><img src="https://avatars.githubusercontent.com/u/16888873?v=4?s=100" width="100px;" alt="MARCEL"/><br /><sub><b>MARCEL</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=1337MARCEL" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://neilor.facss.io/"><img src="https://avatars.githubusercontent.com/u/4008023?v=4?s=100" width="100px;" alt="Neilor Caldeira"/><br /><sub><b>Neilor Caldeira</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=neilor" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://tobi.sh/"><img src="https://avatars.githubusercontent.com/u/2978876?v=4?s=100" width="100px;" alt="Tobias Lins"/><br /><sub><b>Tobias Lins</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=tobiaslins" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fintara"><img src="https://avatars.githubusercontent.com/u/4290594?v=4?s=100" width="100px;" alt="Tsvetan"/><br /><sub><b>Tsvetan</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=fintara" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://twitter.com/yesmeck"><img src="https://avatars.githubusercontent.com/u/465125?v=4?s=100" width="100px;" alt="Wei Zhu"/><br /><sub><b>Wei Zhu</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=yesmeck" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/yakkomajuri"><img src="https://avatars.githubusercontent.com/u/38760734?v=4?s=100" width="100px;" alt="Yakko Majuri"/><br /><sub><b>Yakko Majuri</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=yakkomajuri" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fhellwig"><img src="https://avatars.githubusercontent.com/u/1703592?v=4?s=100" width="100px;" alt="Frank Hellwig"/><br /><sub><b>Frank Hellwig</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=fhellwig" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/theskillwithin"><img src="https://avatars.githubusercontent.com/u/8095506?v=4?s=100" width="100px;" alt="Austin Peterson"/><br /><sub><b>Austin Peterson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=theskillwithin" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/thodubois"><img src="https://avatars.githubusercontent.com/u/37809039?v=4?s=100" width="100px;" alt="thodubois"/><br /><sub><b>thodubois</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=thodubois" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/weschristiansen"><img src="https://avatars.githubusercontent.com/u/5215218?v=4?s=100" width="100px;" alt="wes christiansen"/><br /><sub><b>wes christiansen</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=weschristiansen" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cjpatoilo"><img src="https://avatars.githubusercontent.com/u/1542831?v=4?s=100" width="100px;" alt="CJ Patoilo"/><br /><sub><b>CJ Patoilo</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=cjpatoilo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mar1u50"><img src="https://avatars.githubusercontent.com/u/17710919?v=4?s=100" width="100px;" alt="mar1u50"/><br /><sub><b>mar1u50</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mar1u50" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ayushman.me/"><img src="https://avatars.githubusercontent.com/u/38486014?v=4?s=100" width="100px;" alt="Ayushman Gupta"/><br /><sub><b>Ayushman Gupta</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ayushman-git" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RafaelFerreiraTVD"><img src="https://avatars.githubusercontent.com/u/15105462?v=4?s=100" width="100px;" alt="Rafael Ferreira"/><br /><sub><b>Rafael Ferreira</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=RafaelFerreiraTVD" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/krijoh92"><img src="https://avatars.githubusercontent.com/u/1156014?v=4?s=100" width="100px;" alt="Kristinn Thor Johannsson"/><br /><sub><b>Kristinn Thor Johannsson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=krijoh92" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://michaelmakes.games/"><img src="https://avatars.githubusercontent.com/u/5983927?v=4?s=100" width="100px;" alt="Michael Moore"/><br /><sub><b>Michael Moore</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=MichaelMakesGames" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://trevorblades.com/"><img src="https://avatars.githubusercontent.com/u/1216917?v=4?s=100" width="100px;" alt="Trevor Blades"/><br /><sub><b>Trevor Blades</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=trevorblades" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrdulin"><img src="https://avatars.githubusercontent.com/u/17866683?v=4?s=100" width="100px;" alt="official_dulin"/><br /><sub><b>official_dulin</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mrdulin" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/billymosis"><img src="https://avatars.githubusercontent.com/u/57342180?v=4?s=100" width="100px;" alt="Billy Mosis Priambodo"/><br /><sub><b>Billy Mosis Priambodo</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=billymosis" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://staffordwilliams.com/"><img src="https://avatars.githubusercontent.com/u/6289998?v=4?s=100" width="100px;" alt="Stafford Williams"/><br /><sub><b>Stafford Williams</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=staff0rd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/superLipbalm"><img src="https://avatars.githubusercontent.com/u/77329061?v=4?s=100" width="100px;" alt="Chanhee Kim"/><br /><sub><b>Chanhee Kim</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=superLipbalm" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hooriza"><img src="https://avatars.githubusercontent.com/u/507927?v=4?s=100" width="100px;" alt="Hooriza"/><br /><sub><b>Hooriza</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=hooriza" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nilsw.io/"><img src="https://avatars.githubusercontent.com/u/1405318?v=4?s=100" width="100px;" alt="Nils Wittler"/><br /><sub><b>Nils Wittler</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=nlswtlr" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sszczep"><img src="https://avatars.githubusercontent.com/u/21238816?v=4?s=100" width="100px;" alt="Sebastian Szczepański"/><br /><sub><b>Sebastian Szczepański</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=sszczep" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://pka.netlify.app/"><img src="https://avatars.githubusercontent.com/u/31067376?v=4?s=100" width="100px;" alt="Mahendra Choudhary"/><br /><sub><b>Mahendra Choudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=pikaatic" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ssmkhrj"><img src="https://avatars.githubusercontent.com/u/49264891?v=4?s=100" width="100px;" alt="Som Shekhar Mukherjee"/><br /><sub><b>Som Shekhar Mukherjee</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ssmkhrj" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://qpan.dev/"><img src="https://avatars.githubusercontent.com/u/17402261?v=4?s=100" width="100px;" alt="Qiushi Pan"/><br /><sub><b>Qiushi Pan</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=qqpann" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://jishnu.me/"><img src="https://avatars.githubusercontent.com/u/754818?v=4?s=100" width="100px;" alt="Jishnu Viswanath"/><br /><sub><b>Jishnu Viswanath</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=neolivz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/brahambence"><img src="https://avatars.githubusercontent.com/u/11694244?v=4?s=100" width="100px;" alt="brahambence"/><br /><sub><b>brahambence</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=brahambence" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=100" width="100px;" alt="dependabot[bot]"/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dependabot[bot]" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/renovate"><img src="https://avatars.githubusercontent.com/in/2740?v=4?s=100" width="100px;" alt="renovate[bot]"/><br /><sub><b>renovate[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=renovate[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/dependabot-preview"><img src="https://avatars.githubusercontent.com/in/2141?v=4?s=100" width="100px;" alt="dependabot-preview[bot]"/><br /><sub><b>dependabot-preview[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dependabot-preview[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4?s=100" width="100px;" alt="github-actions[bot]"/><br /><sub><b>github-actions[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=github-actions[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/allcontributors"><img src="https://avatars.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt="allcontributors[bot]"/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=allcontributors[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/zhangenming"><img src="https://avatars.githubusercontent.com/u/21235555?v=4?s=100" width="100px;" alt="zhangenming"/><br /><sub><b>zhangenming</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=zhangenming" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/akiszka"><img src="https://avatars.githubusercontent.com/u/30828906?v=4?s=100" width="100px;" alt="Antoni Kiszka"/><br /><sub><b>Antoni Kiszka</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=akiszka" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/gpoole_is_taken"><img src="https://avatars.githubusercontent.com/u/2898433?v=4?s=100" width="100px;" alt="Greg Poole"/><br /><sub><b>Greg Poole</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=gpoole" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/mergify"><img src="https://avatars.githubusercontent.com/in/10562?v=4?s=100" width="100px;" alt="mergify[bot]"/><br /><sub><b>mergify[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mergify[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Chaitanya7666"><img src="https://avatars.githubusercontent.com/u/56331036?v=4?s=100" width="100px;" alt="Chaitanya J"/><br /><sub><b>Chaitanya J</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=Chaitanya7666" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://gmahima.dev/"><img src="https://avatars.githubusercontent.com/u/39587007?v=4?s=100" width="100px;" alt="G H Mahimaanvita"/><br /><sub><b>G H Mahimaanvita</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=gmahima" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/danilowoz"><img src="https://avatars.githubusercontent.com/u/4838076?v=4?s=100" width="100px;" alt="Danilo Woznica"/><br /><sub><b>Danilo Woznica</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=danilowoz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dan-klasson"><img src="https://avatars.githubusercontent.com/u/1314838?v=4?s=100" width="100px;" alt="dan-klasson"/><br /><sub><b>dan-klasson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dan-klasson" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://soluble.io/pro"><img src="https://avatars.githubusercontent.com/u/259798?v=4?s=100" width="100px;" alt="Sébastien Vanvelthem"/><br /><sub><b>Sébastien Vanvelthem</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=belgattitude" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://drk.me.uk/"><img src="https://avatars.githubusercontent.com/u/8918168?v=4?s=100" width="100px;" alt="Aleksandr Soldatov"/><br /><sub><b>Aleksandr Soldatov</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=aso1datov" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/reflog"><img src="https://avatars.githubusercontent.com/u/109876?v=4?s=100" width="100px;" alt="Eli Yukelzon"/><br /><sub><b>Eli Yukelzon</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=reflog" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://pka.netlify.app/"><img src="https://avatars.githubusercontent.com/u/31067376?v=4?s=100" width="100px;" alt="Mahendra Choudhary"/><br /><sub><b>Mahendra Choudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mahendrjy" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/7777chaitanya"><img src="https://avatars.githubusercontent.com/u/56331036?v=4?s=100" width="100px;" alt="Chaitanya J"/><br /><sub><b>Chaitanya J</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=7777chaitanya" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TkDodo"><img src="https://avatars.githubusercontent.com/u/1021430?v=4?s=100" width="100px;" alt="Dominik Dorfmeister"/><br /><sub><b>Dominik Dorfmeister</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=TkDodo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://12bay.vn/"><img src="https://avatars.githubusercontent.com/u/4768095?v=4?s=100" width="100px;" alt="Nghiệp"/><br /><sub><b>Nghiệp</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=nghiepdev" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/edoko"><img src="https://avatars.githubusercontent.com/u/1365682?v=4?s=100" width="100px;" alt="Seongmin Park"/><br /><sub><b>Seongmin Park</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=edoko" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nathggns"><img src="https://avatars.githubusercontent.com/u/719814?v=4?s=100" width="100px;" alt="Nate Higgins"/><br /><sub><b>Nate Higgins</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=nathggns" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://oatmeal.gg/"><img src="https://avatars.githubusercontent.com/u/5983927?v=4?s=100" width="100px;" alt="Michael Moore"/><br /><sub><b>Michael Moore</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=oatmealproblem" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/John0x"><img src="https://avatars.githubusercontent.com/u/5455173?v=4?s=100" width="100px;" alt="Moritz Brandes"/><br /><sub><b>Moritz Brandes</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=John0x" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/som-sm"><img src="https://avatars.githubusercontent.com/u/49264891?v=4?s=100" width="100px;" alt="Som Shekhar Mukherjee"/><br /><sub><b>Som Shekhar Mukherjee</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=som-sm" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/cursor"><img src="https://avatars.githubusercontent.com/in/1210556?v=4?s=100" width="100px;" alt="cursor[bot]"/><br /><sub><b>cursor[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=cursor[bot]" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JulianWielga"><img src="https://avatars.githubusercontent.com/u/965924?v=4?s=100" width="100px;" alt="JulianWielga"/><br /><sub><b>JulianWielga</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=JulianWielga" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://aminya.github.io/"><img src="https://avatars.githubusercontent.com/u/16418197?v=4?s=100" width="100px;" alt="Amin Ya"/><br /><sub><b>Amin Ya</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=aminya" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.chaitanya.vip/"><img src="https://avatars.githubusercontent.com/u/56331036?v=4?s=100" width="100px;" alt="Chaitanya Jujjavarapu"/><br /><sub><b>Chaitanya Jujjavarapu</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=chaitanyaj2222" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

</details>

<br/>
