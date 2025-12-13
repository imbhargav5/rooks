<br/>
<br/>
<p align="center">
  <img src="https://i.ibb.co/KpJRdjvj/rooks-graphic.png" height="auto" width="100%" />
</p>
<br/>

<p align="center">
  <img src="https://i.ibb.co/3YkzXHgb/rooks-graphic-1.png" alt="Why Rooks ?" height="auto" width="100%" />
</p>
<br/>

<p align="center">

  <!-- Build & Quality -->

[![CI and Semantic Release](https://github.com/imbhargav5/rooks/actions/workflows/ci-release.yml/badge.svg)](https://github.com/imbhargav5/rooks/actions/workflows/ci-release.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/imbhargav5/rooks)
![GitHub](https://img.shields.io/github/license/imbhargav5/rooks)
![Codecov branch](https://img.shields.io/codecov/c/github/imbhargav5/rooks/main)

  <br/>

  <!-- Package Info -->

![npm](https://img.shields.io/npm/dm/rooks)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/rooks)
![Module](https://img.shields.io/badge/module-esm-brightgreen)
![node-lts](https://img.shields.io/node/v-lts/rooks)

  <br/>

  <!-- Community -->

[![GitHub contributors](https://img.shields.io/github/contributors/imbhargav5/rooks)](#contributors)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Freact-hooks.org)](https://rooks.vercel.app)
![GitHub stars](https://img.shields.io/github/stars/imbhargav5/rooks?style=social)

</p>

<br/>
<br/>
<br/>

<h2 align="center">Collection of awesome react hooks </h2>

<br/>

<p align="center">
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://vercel.com?utm_source=rooks&utm_campaign=oss"
  >
  <img src=".github/powered-by-vercel.svg"  />
  </a>
</p>

<br/>

## 📚 Table of Contents

* [Quick Start](#-quick-start)
* [Why Rooks?](#-why-rooks)
* [Popular Hooks](#-popular-hooks)
* [All Hooks by Category](#-list-of-all-hooks)
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Contributors](#contributors-)
* [License](#license)

<br/>

## 🚀 Quick Start

Get up and running in seconds:

```bash
npm install rooks
# or
yarn add rooks
# or
pnpm add rooks
```

Import any hook and start using it:

```tsx
import { useDidMount, useCounter, useToggle } from "rooks";

function App() {
  const { value, increment, decrement } = useCounter(0);
  const [isOn, toggleIsOn] = useToggle(false);

  useDidMount(() => {
    console.log("Component mounted! 🎉");
  });

  return (
    <div>
      <h1>Count: {value}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>

      <h2>Toggle is {isOn ? "ON" : "OFF"}</h2>
      <button onClick={toggleIsOn}>Toggle</button>
    </div>
  );
}
```

**[📖 Browse all hooks](https://rooks.vercel.app)** • **[🎮 Try in CodeSandbox](https://codesandbox.io/s/rooks-quick-start-example)**

<br/>

## ✨ Why Rooks?

<table>
  <tr>
    <td align="center">🎯</td>
    <td><b>Focused</b><br/>Each hook does one thing well</td>
    <td align="center">📦</td>
    <td><b>Tree-shakeable</b><br/>Import only what you need</td>
  </tr>
  <tr>
    <td align="center">🔄</td>
    <td><b>SSR Ready</b><br/>Works with Next.js, Remix, Gatsby</td>
    <td align="center">🧪</td>
    <td><b>Well Tested</b><br/>95%+ code coverage</td>
  </tr>
  <tr>
    <td align="center">📚</td>
    <td><b>Documented</b><br/>Every hook has examples & demos</td>
    <td align="center">⚡</td>
    <td><b>TypeScript First</b><br/>Full type safety out of the box</td>
  </tr>
  <tr>
    <td align="center">🎨</td>
    <td><b>Modern</b><br/>Built for React 18+ with ESM</td>
    <td align="center">🤝</td>
    <td><b>Community Driven</b><br/>82 contributors and growing</td>
  </tr>
</table>

<br/>

## 🌟 Popular Hooks

### State Management

<table>
  <tr>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useCounter">useCounter</a></b><br/>
      <sub>Counter with increment/decrement</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useToggle">useToggle</a></b><br/>
      <sub>Toggle between values</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useLocalstorageState">useLocalstorageState</a></b><br/>
      <sub>useState with localStorage sync</sub>
    </td>
  </tr>
  <tr>
    <td>
      <code>const { value, increment }</code><br/>
      <code>= useCounter(0)</code>
    </td>
    <td>
      <code>const [on, toggle]</code><br/>
      <code>= useToggle()</code>
    </td>
    <td>
      <code>const [user, setUser]</code><br/>
      <code>= useLocalstorageState('user')</code>
    </td>
  </tr>
</table>

### Event Handling

<table>
  <tr>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useKey">useKey</a></b><br/>
      <sub>Keyboard event handling</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useOutsideClick">useOutsideClick</a></b><br/>
      <sub>Detect clicks outside element</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useOnClickRef">useOnClickRef</a></b><br/>
      <sub>Click handler with ref</sub>
    </td>
  </tr>
</table>

### Lifecycle & Effects

<table>
  <tr>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useDidMount">useDidMount</a></b><br/>
      <sub>componentDidMount equivalent</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useWillUnmount">useWillUnmount</a></b><br/>
      <sub>componentWillUnmount equivalent</sub>
    </td>
    <td width="33%">
      <b><a href="https://rooks.vercel.app/docs/hooks/useDebounce">useDebounce</a></b><br/>
      <sub>Debounce any value</sub>
    </td>
  </tr>
</table>

<br/>

**<h2 align="center">List of all hooks</h2>**

<!--hookslist start-->

<details>
<summary><h3>🎬 Animation & Timing - 10 hooks</h3></summary>



* [useAnimation](https://rooks.vercel.app/docs/hooks/useAnimation) - Animation hook for React
* [useEasing](https://rooks.vercel.app/docs/hooks/useEasing) - A hook for creating controlled easing animations with start/stop/reset capabilities.
* [useIntervalWhen](https://rooks.vercel.app/docs/hooks/useIntervalWhen) - Sets an interval immediately when a condition is true
* [useLockBodyScroll](https://rooks.vercel.app/docs/hooks/useLockBodyScroll) - This hook locks the scroll of the body element when `isLocked` is set to `true`.
* [usePrefersReducedMotion](https://rooks.vercel.app/docs/hooks/usePrefersReducedMotion) - A React hook that returns true if the user has enabled the 'prefers-reduced-motion' setting in their system.
* [useRaf](https://rooks.vercel.app/docs/hooks/useRaf) - A continuously running requestAnimationFrame hook for React
* [useResizeObserverRef](https://rooks.vercel.app/docs/hooks/useResizeObserverRef) - Resize Observer hook for React.
* [useSpring](https://rooks.vercel.app/docs/hooks/useSpring) - Spring animation hook for React
* [useTimeoutWhen](https://rooks.vercel.app/docs/hooks/useTimeoutWhen) - Takes a callback and fires it when a condition is true
* [useTween](https://rooks.vercel.app/docs/hooks/useTween) - Tween animation hook for React


</details>



<details open>
<summary><h3>🌐 Browser APIs - 16 hooks</h3></summary>



* [useBroadcastChannel](https://rooks.vercel.app/docs/hooks/useBroadcastChannel) - A React hook that provides a clean interface to the Broadcast Channel API for cross-tab/window communication
* [useClipboard](https://rooks.vercel.app/docs/hooks/useClipboard) - Clipboard read/write operations hook for React
* [useGeolocation](https://rooks.vercel.app/docs/hooks/useGeolocation) - A hook to provide the geolocation info on client side.
* [useIdleDetectionApi](https://rooks.vercel.app/docs/hooks/useIdleDetectionApi) - Hook to detect when user is idle using Idle Detection API with polyfill
* [useMediaRecorder](https://rooks.vercel.app/docs/hooks/useMediaRecorder) - Audio/video recording from MediaStream
* [useNetworkInformation](https://rooks.vercel.app/docs/hooks/useNetworkInformation) - Network connection quality detection hook for React
* [useNavigatorLanguage](https://rooks.vercel.app/docs/hooks/useNavigatorLanguage) - Navigator Language hook for React.
* [useNotification](https://rooks.vercel.app/docs/hooks/useNotification) - Browser notifications with permission handling
* [useOnline](https://rooks.vercel.app/docs/hooks/useOnline) - Online status hook for React.
* [useOrientation](https://rooks.vercel.app/docs/hooks/useOrientation) - orientation hook for react
* [useScreenDetailsApi](https://rooks.vercel.app/docs/hooks/useScreenDetailsApi) - Hook for multi-screen information and management using Screen Details API
* [useWebLocksApi](https://rooks.vercel.app/docs/hooks/useWebLocksApi) - Hook for coordinating operations across tabs/workers with Web Locks API
* [useShare](https://rooks.vercel.app/docs/hooks/useShare) - Web Share API for native sharing
* [useSpeech](https://rooks.vercel.app/docs/hooks/useSpeech) - Speech synthesis hook for React
* [useFetch](https://rooks.vercel.app/docs/hooks/useFetch) - Hook for fetching data from URLs with loading states, error handling, and automatic JSON parsing
* [useVibrate](https://rooks.vercel.app/docs/hooks/useVibrate) - Vibration API hook for React


</details>



<details>
<summary><h3>🛠️ Development & Debugging - 1 hook</h3></summary>



* [useRenderCount](https://rooks.vercel.app/docs/hooks/useRenderCount) - Get the render count of a component


</details>



<details open>
<summary><h3>🚀 Events - 16 hooks</h3></summary>



* [useDocumentEventListener](https://rooks.vercel.app/docs/hooks/useDocumentEventListener) - A react hook to an event listener to the document object
* [useDocumentVisibilityState](https://rooks.vercel.app/docs/hooks/useDocumentVisibilityState) - Returns the visibility state of the document.
* [useFocus](https://rooks.vercel.app/docs/hooks/useFocus) - Handles focus events for the immediate target element.
* [useFocusWithin](https://rooks.vercel.app/docs/hooks/useFocusWithin) - Handles focus events for the target component.
* [useIsDroppingFiles](https://rooks.vercel.app/docs/hooks/useIsDroppingFiles) - Check if any files are currently being dropped anywhere. Useful for highlighting drop areas.
* [useOnClickRef](https://rooks.vercel.app/docs/hooks/useOnClickRef) - Callback on click/tap events
* [useOnHoverRef](https://rooks.vercel.app/docs/hooks/useOnHoverRef) - On hover callback hook
* [useOnLongHover](https://rooks.vercel.app/docs/hooks/useOnLongHover) - Fires a callback when an element is hovered for a while
* [useOnLongPress](https://rooks.vercel.app/docs/hooks/useOnLongPress) - Fire a callback on long press
* [useOnStartTyping](https://rooks.vercel.app/docs/hooks/useOnStartTyping) - Fires a callback when the user starts typing outside editable fields (input, textarea, contenteditable). Supports filtering for a-z and 0-9 keys.
* [useOnWindowResize](https://rooks.vercel.app/docs/hooks/useOnWindowResize) - A React hook for adding an event listener for window resize
* [useOnWindowScroll](https://rooks.vercel.app/docs/hooks/useOnWindowScroll) - A React hook for adding an event listener for window scroll
* [useOutsideClick](https://rooks.vercel.app/docs/hooks/useOutsideClick) - Outside click(for a ref) event as hook for React.
* [useOutsideClickRef](https://rooks.vercel.app/docs/hooks/useOutsideClickRef) - A hook that can track a click event outside a ref. Returns a callbackRef.
* [usePageLeave](https://rooks.vercel.app/docs/hooks/usePageLeave) - Page leave detection with callbacks for beforeunload and visibility change
* [useWindowEventListener](https://rooks.vercel.app/docs/hooks/useWindowEventListener) - Adds an event listener to window


</details>



<details>
<summary><h3>📝 Form & File Handling - 3 hooks</h3></summary>



* [useCheckboxInputState](https://rooks.vercel.app/docs/hooks/useCheckboxInputState) - Simple checkbox state management hook that provides a boolean state and props that can be spread directly onto a checkbox input element
* [useFileDropRef](https://rooks.vercel.app/docs/hooks/useFileDropRef) - Drop files easily
* [useFormState](https://rooks.vercel.app/docs/hooks/useFormState) - Comprehensive form state management with validation


</details>



<details>
<summary><h3>⌨️ Keyboard & Input - 5 hooks</h3></summary>



* [useInput](https://rooks.vercel.app/docs/hooks/useInput) - Input hook for React.
* [useKey](https://rooks.vercel.app/docs/hooks/useKey) - keypress, keyup and keydown event handlers as hooks for react.
* [useKeyBindings](https://rooks.vercel.app/docs/hooks/useKeyBindings) - useKeyBindings can bind multiple keys to multiple callbacks and fire the callbacks on key press.
* [useKeyRef](https://rooks.vercel.app/docs/hooks/useKeyRef) - Very similar useKey but it returns a ref
* [useKeys](https://rooks.vercel.app/docs/hooks/useKeys) - A hook which allows to setup callbacks when a combination of keys are pressed at the same time.


</details>



<details open>
<summary><h3>🔥 Lifecycle & Effects - 11 hooks</h3></summary>



* [useAsyncEffect](https://rooks.vercel.app/docs/hooks/useAsyncEffect) - A version of useEffect that accepts an async function
* [useDebouncedAsyncEffect](https://rooks.vercel.app/docs/hooks/useDebouncedAsyncEffect) - A version of useEffect that accepts an async function and debounces its execution based on dependency changes
* [useDebouncedEffect](https://rooks.vercel.app/docs/hooks/useDebouncedEffect) - A version of useEffect that debounces the effect execution based on dependency changes
* [useDeepCompareEffect](https://rooks.vercel.app/docs/hooks/useDeepCompareEffect) - Deep compare dependencies instead of shallow for useEffect
* [useDidMount](https://rooks.vercel.app/docs/hooks/useDidMount) - componentDidMount hook for React
* [useDidUpdate](https://rooks.vercel.app/docs/hooks/useDidUpdate) - componentDidUpdate hook for react
* [useDocumentTitle](https://rooks.vercel.app/docs/hooks/useDocumentTitle) - A hook to easily update document title with React
* [useEffectOnceWhen](https://rooks.vercel.app/docs/hooks/useEffectOnceWhen) - Runs a callback effect atmost one time when a condition becomes true
* [useIsomorphicEffect](https://rooks.vercel.app/docs/hooks/useIsomorphicEffect) - A hook that resolves to useEffect on the server and useLayoutEffect on the client.
* [useLifecycleLogger](https://rooks.vercel.app/docs/hooks/useLifecycleLogger) - A react hook that console logs parameters as component transitions through lifecycles.
* [useWillUnmount](https://rooks.vercel.app/docs/hooks/useWillUnmount) - componentWillUnmount lifecycle as hook for React.


</details>



<details>
<summary><h3>🖱️ Mouse & Touch - 3 hooks</h3></summary>



* [useMouse](https://rooks.vercel.app/docs/hooks/useMouse) - Mouse position hook for React.
* [useMouseMoveDelta](https://rooks.vercel.app/docs/hooks/useMouseMoveDelta) - Tracks delta of mouse move
* [useMouseWheelDelta](https://rooks.vercel.app/docs/hooks/useMouseWheelDelta) - Tracks delta of mouse move


</details>



<details>
<summary><h3>⚡ Performance & Optimization - 5 hooks</h3></summary>



* [useDebounce](https://rooks.vercel.app/docs/hooks/useDebounce) - Debounce hook for react
* [useDebouncedValue](https://rooks.vercel.app/docs/hooks/useDebouncedValue) - Tracks another value and gets updated in a debounced way.
* [useDebounceFn](https://rooks.vercel.app/docs/hooks/useDebounceFn) - Powerful debounce function hook for React
* [useThrottle](https://rooks.vercel.app/docs/hooks/useThrottle) - Throttle custom hook for React
* [useWebWorker](https://rooks.vercel.app/docs/hooks/useWebWorker) - Web Worker management with message passing


</details>



<details open>
<summary><h3>❇️ State - 18 hooks</h3></summary>



* [useArrayState](https://rooks.vercel.app/docs/hooks/useArrayState) - Array state manager hook for React
* [useCountdown](https://rooks.vercel.app/docs/hooks/useCountdown) - Count down to a target timestamp and call callbacks every second (or provided peried)
* [useCounter](https://rooks.vercel.app/docs/hooks/useCounter) - Counter hook for React.
* [useGetIsMounted](https://rooks.vercel.app/docs/hooks/useGetIsMounted) - Checks if a component is mounted or not at the time. Useful for async effects
* [useLocalstorageState](https://rooks.vercel.app/docs/hooks/useLocalstorageState) - UseState but auto updates values to localStorage
* [useMapState](https://rooks.vercel.app/docs/hooks/useMapState) - A react hook to manage state in a key value pair map.
* [useMultiSelectableList](https://rooks.vercel.app/docs/hooks/useMultiSelectableList) - A custom hook to easily select multiple values from a list
* [useNativeMapState](https://rooks.vercel.app/docs/hooks/useNativeMapState) - Manage Map() object state in React
* [usePreviousDifferent](https://rooks.vercel.app/docs/hooks/usePreviousDifferent) - usePreviousDifferent returns the last different value of a variable
* [usePreviousImmediate](https://rooks.vercel.app/docs/hooks/usePreviousImmediate) - usePreviousImmediate returns the previous value of a variable even if it was the same or different
* [usePromise](https://rooks.vercel.app/docs/hooks/usePromise) - Promise management hook for react
* [useQueueState](https://rooks.vercel.app/docs/hooks/useQueueState) - A React hook that manages state in the form of a queue
* [useSafeSetState](https://rooks.vercel.app/docs/hooks/useSafeSetState) - set state but ignores if component has already unmounted
* [useSelect](https://rooks.vercel.app/docs/hooks/useSelect) - Select values from a list easily. List selection hook for react.
* [useSelectableList](https://rooks.vercel.app/docs/hooks/useSelectableList) - Easily select a single value from a list of values. very useful for radio buttons, select inputs  etc.
* [useSessionstorageState](https://rooks.vercel.app/docs/hooks/useSessionstorageState) - useState but syncs with sessionstorage
* [useSetState](https://rooks.vercel.app/docs/hooks/useSetState) - Manage the state of a Set in React.
* [useStackState](https://rooks.vercel.app/docs/hooks/useStackState) - A React hook that manages state in the form of a stack


</details>



<details>
<summary><h3>🔄 State History & Time Travel - 4 hooks</h3></summary>



* [useTimeTravelState](https://rooks.vercel.app/docs/hooks/useTimeTravelState) - A hook that manages state which can undo and redo. A more powerful version of useUndoState hook.
* [useToggle](https://rooks.vercel.app/docs/hooks/useToggle) - Toggle (between booleans or custom data)hook for React.
* [useUndoRedoState](https://rooks.vercel.app/docs/hooks/useUndoRedoState) - Setstate but can also undo and redo
* [useUndoState](https://rooks.vercel.app/docs/hooks/useUndoState) - Drop in replacement for useState hook but with undo functionality.


</details>



<details>
<summary><h3>⚛️ UI - 14 hooks</h3></summary>



* [useAudio](https://rooks.vercel.app/docs/hooks/useAudio) - Audio hook
* [useBoundingclientrect](https://rooks.vercel.app/docs/hooks/useBoundingclientrect) - getBoundingClientRect hook for React.
* [useBoundingclientrectRef](https://rooks.vercel.app/docs/hooks/useBoundingclientrectRef) - A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked.
* [useDimensionsRef](https://rooks.vercel.app/docs/hooks/useDimensionsRef) - Easily grab dimensions of an element with a ref using this hook
* [useFullscreen](https://rooks.vercel.app/docs/hooks/useFullscreen) - Use full screen api for making beautiful and emersive experinces.
* [useMeasure](https://rooks.vercel.app/docs/hooks/useMeasure) - Measures both inner and outer dimensions of any DOM element in a performant way and updates when dimensions change
* [useIntersectionObserverRef](https://rooks.vercel.app/docs/hooks/useIntersectionObserverRef) - A hook to register an intersection observer listener.
* [useInViewRef](https://rooks.vercel.app/docs/hooks/useInViewRef) - Simple hook that monitors element enters or leave the viewport that's using Intersection Observer API.
* [useMediaMatch](https://rooks.vercel.app/docs/hooks/useMediaMatch) - Signal whether or not a media query is currently matched.
* [useMutationObserver](https://rooks.vercel.app/docs/hooks/useMutationObserver) - Mutation Observer hook for React.
* [useMutationObserverRef](https://rooks.vercel.app/docs/hooks/useMutationObserverRef) - A hook that tracks mutations of an element. It returns a callbackRef.
* [usePictureInPictureApi](https://rooks.vercel.app/docs/hooks/usePictureInPictureApi) - Hook for managing Picture-in-Picture video functionality
* [usePreferredColorScheme](https://rooks.vercel.app/docs/hooks/usePreferredColorScheme) - Color scheme preference detection (dark/light mode)
* [useVideo](https://rooks.vercel.app/docs/hooks/useVideo) - Video hook for react


</details>



<details>
<summary><h3>🔧 Utilities & Refs - 7 hooks</h3></summary>



* [useEventListenerRef](https://rooks.vercel.app/docs/hooks/useEventListenerRef) - A react hook to add an event listener to a ref
* [useForkRef](https://rooks.vercel.app/docs/hooks/useForkRef) - A hook that can combine two refs(mutable or callbackRefs) into a single callbackRef
* [useFreshCallback](https://rooks.vercel.app/docs/hooks/useFreshCallback) - Avoid stale closures and keep your callback fresh
* [useFreshRef](https://rooks.vercel.app/docs/hooks/useFreshRef) - Avoid stale state in callbacks with this hook. Auto updates values using a ref.
* [useFreshTick](https://rooks.vercel.app/docs/hooks/useFreshTick) - Like use-fresh-ref but specifically for functions
* [useMergeRefs](https://rooks.vercel.app/docs/hooks/useMergeRefs) - Merges any number of refs into a single ref
* [useRefElement](https://rooks.vercel.app/docs/hooks/useRefElement) - Helps bridge gap between callback ref and state


</details>



<details>
<summary><h3>📱 Window & Viewport - 2 hooks</h3></summary>



* [useWindowScrollPosition](https://rooks.vercel.app/docs/hooks/useWindowScrollPosition) - A React hook to get the scroll position of the window
* [useWindowSize](https://rooks.vercel.app/docs/hooks/useWindowSize) - Window size hook for React.


</details>



<details>
<summary><h3>🧪 Experimental Hooks - 5 hooks</h3></summary>



* [useSuspenseNavigatorBattery](https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorBattery) - Suspense-enabled hook for getting battery status information from Navigator Battery API
* [useSuspenseNavigatorUserAgentData](https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorUserAgentData) - Suspense-enabled hook for getting high entropy values from Navigator User Agent Data API
* [useSuspenseLocalStorageState](https://rooks.vercel.app/docs/hooks/useSuspenseLocalStorageState) - Suspense-enabled hook for localStorage state management with cross-tab synchronization
* [useSuspenseSessionStorageState](https://rooks.vercel.app/docs/hooks/useSuspenseSessionStorageState) - Suspense-enabled hook for sessionStorage state management with proper serialization
* [useSuspenseIndexedDBState](https://rooks.vercel.app/docs/hooks/useSuspenseIndexedDBState) - Suspense-enabled hook for IndexedDB state management with structured data storage and cross-tab synchronization


<p align="center"><em>⚠️ Experimental hooks may be removed or significantly changed in any release without notice. Use with caution in production.</em></p>



</details>



<!--hookslist end-->

<br/>
<br/>

## Features

<!--hookscount start-->

✅ Collection of 120 hooks as standalone modules.

<!--hookscount end-->

✅ Standalone package with all the hooks at one place

✅ Built for ESM

## Installation

```
npm i -s rooks
```

Import any hook from "rooks" and start using them!

```jsx
import { useDidMount } from "rooks";
```

## Usage

```jsx
function App() {
  useDidMount(() => {
    alert("mounted");
  });
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```

## Standalone Package

Package containing all the hooks is over here. - [Docs](https://github.com/imbhargav5/rooks/tree/master/packages/rooks) and [Npm Install](https://npmjs.com/package/rooks)

<br/>

## License

MIT

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-82-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<details>
<summary><b>View all 82 contributors</b></summary>

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
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

</details>

<br/>

## Other hooks libraries

These are some libraries that I constantly take inspiration and ideas from

1. [React-use](https://github.com/streamich/react-use)
2. [React-aria](https://react-spectrum.adobe.com/react-aria)
3. [Valtio](https://github.com/pmndrs/valtio)
4. [Jotai](https://github.com/pmndrs/jotai/tree/)
5. [Recoil](https://recoiljs.org/)
6. [Downshiftjs](https://www.downshift-js.com/)
7. [React hook form](https://react-hook-form.com/)
