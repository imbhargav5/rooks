<br/>
<br/>
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/761126463457460234/775262278026788885/Final_Copy_8.png" height="auto" width="100%" />
</p>
<br/>

[![CI and Semantic Release](https://github.com/imbhargav5/rooks/actions/workflows/ci-release.yml/badge.svg)](https://github.com/imbhargav5/rooks/actions/workflows/ci-release.yml) ![GitHub](https://img.shields.io/github/license/imbhargav5/rooks) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/imbhargav5/rooks) [![GitHub contributors](https://img.shields.io/github/contributors/imbhargav5/rooks)](#contributors) ![npm](https://img.shields.io/npm/dw/rooks) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/rooks) ![Codecov branch](https://img.shields.io/codecov/c/github/imbhargav5/rooks/main) ![node-lts](https://img.shields.io/node/v-lts/rooks) [![Website](https://img.shields.io/website?url=https%3A%2F%2Freact-hooks.org)](https://rooks.vercel.app) ![Module](https://img.shields.io/badge/module-umd%2Ccjs%2Cesm-brightgreen)

<br/>
<br/>
<br/>

<h2 align="center">Essential React custom hooks ⚓ to super charge your components! </h2>

<br/>

<p align="center">
  <a 
    target="_blank"
    rel="noopener noreferrer"
    href="https://vercel.com?utm_source=rooks&utm_campaign=oss"
  >
  <img src="../../.github/powered-by-vercel.svg"  />
  </a>
</p>

<br/>

**<h2 align="center">List of all hooks</h2>**

<!--hookslist start-->

**<h3 align="center">🔥 Effects</h3>**

*   [useAsyncEffect](https://rooks.vercel.app/docs/useAsyncEffect) - A version of useEffect that accepts an async function
*   [useDeepCompareEffect](https://rooks.vercel.app/docs/useDeepCompareEffect) - Deep compare dependencies instead of shallow for useEffect
*   [useDidMount](https://rooks.vercel.app/docs/useDidMount) - componentDidMount hook for React
*   [useDidUpdate](https://rooks.vercel.app/docs/useDidUpdate) - componentDidUpdate hook for react
*   [useDocumentTitle](https://rooks.vercel.app/docs/useDocumentTitle) - A hook to easily update document title with React
*   [useEffectOnceWhen](https://rooks.vercel.app/docs/useEffectOnceWhen) - Runs a callback effect atmost one time when a condition becomes true
*   [useIntervalWhen](https://rooks.vercel.app/docs/useIntervalWhen) - Sets an interval immediately when a condition is true
*   [useIsomorphicEffect](https://rooks.vercel.app/docs/useIsomorphicEffect) - A hook that resolves to useEffect on the server and useLayoutEffect on the client.
*   [useLifecycleLogger](https://rooks.vercel.app/docs/useLifecycleLogger) - A react hook that console logs parameters as component transitions through lifecycles.
*   [useLockBodyScroll](https://rooks.vercel.app/docs/useLockBodyScroll) - This hook locks the scroll of the body element when `isLocked` is set to `true`.
*   [useMouseMoveDelta](https://rooks.vercel.app/docs/useMouseMoveDelta) - Tracks delta of mouse move
*   [useMouseWheelDelta](https://rooks.vercel.app/docs/useMouseWheelDelta) - Tracks delta of mouse move
*   [useWillUnmount](https://rooks.vercel.app/docs/useWillUnmount) - componentWillUnmount lifecycle as hook for React.

**<h3 align="center">🚀 Events</h3>**

*   [useDocumentEventListener](https://rooks.vercel.app/docs/useDocumentEventListener) - A react hook to an event listener to the document object
*   [useDocumentVisibilityState](https://rooks.vercel.app/docs/useDocumentVisibilityState) - Returns the visibility state of the document.
*   [useFocus](https://rooks.vercel.app/docs/useFocus) - Handles focus events for the immediate target element.
*   [useFocusWithin](https://rooks.vercel.app/docs/useFocusWithin) - Handles focus events for the target component.
*   [useIsDroppingFiles](https://rooks.vercel.app/docs/useIsDroppingFiles) - Check if any files are currently being dropped anywhere. Useful for highlighting drop areas.
*   [useOnClickRef](https://rooks.vercel.app/docs/useOnClickRef) - Callback on click/tap events
*   [useOnHoverRef](https://rooks.vercel.app/docs/useOnHoverRef) - On hover callback hook
*   [useOnLongHover](https://rooks.vercel.app/docs/useOnLongHover) - Fires a callback when an element is hovered for a while
*   [useOnLongPress](https://rooks.vercel.app/docs/useOnLongPress) - Fire a callback on long press
*   [useOnWindowResize](https://rooks.vercel.app/docs/useOnWindowResize) - A React hook for adding an event listener for window resize
*   [useOnWindowScroll](https://rooks.vercel.app/docs/useOnWindowScroll) - A React hook for adding an event listener for window scroll
*   [useOutsideClick](https://rooks.vercel.app/docs/useOutsideClick) - Outside click(for a ref) event as hook for React.
*   [useOutsideClickRef](https://rooks.vercel.app/docs/useOutsideClickRef) - A hook that can track a click event outside a ref. Returns a callbackRef.
*   [useWindowEventListener](https://rooks.vercel.app/docs/useWindowEventListener) - Adds an event listener to window

**<h3 align="center">📝 Form</h3>**

*   [useFileDropRef](https://rooks.vercel.app/docs/useFileDropRef) - Drop files easily
*   [useInput](https://rooks.vercel.app/docs/useInput) - Input hook for React.

**<h3 align="center">✨ Misc</h3>**

*   [useDebounce](https://rooks.vercel.app/docs/useDebounce) - Debounce hook for react
*   [useDebounceFn](https://rooks.vercel.app/docs/useDebounceFn) - Powerful debounce function hook for React
*   [useDebouncedValue](https://rooks.vercel.app/docs/useDebouncedValue) - Tracks another value and gets updated in a debounced way.
*   [useDimensionsRef](https://rooks.vercel.app/docs/useDimensionsRef) - Easily grab dimensions of an element with a ref using this hook
*   [useEventListenerRef](https://rooks.vercel.app/docs/useEventListenerRef) - A react hook to add an event listener to a ref
*   [useForkRef](https://rooks.vercel.app/docs/useForkRef) - A hook that can combine two refs(mutable or callbackRefs) into a single callbackRef
*   [useFreshCallback](https://rooks.vercel.app/docs/useFreshCallback) - Avoid stale closures and keep your callback fresh
*   [useFreshRef](https://rooks.vercel.app/docs/useFreshRef) - Avoid stale state in callbacks with this hook. Auto updates values using a ref.
*   [useFreshTick](https://rooks.vercel.app/docs/useFreshTick) - Like use-fresh-ref but specifically for functions
*   [useMergeRefs](https://rooks.vercel.app/docs/useMergeRefs) - Merges any number of refs into a single ref
*   [useOrientation](https://rooks.vercel.app/docs/useOrientation) - orientation hook for react
*   [useRefElement](https://rooks.vercel.app/docs/useRefElement) - Helps bridge gap between callback ref and state
*   [useRenderCount](https://rooks.vercel.app/docs/useRenderCount) - Get the render count of a component
*   [useSpeech](https://rooks.vercel.app/docs/useSpeech) - Speech synthesis hook for React
*   [useThrottle](https://rooks.vercel.app/docs/useThrottle) - Throttle custom hook for React
*   [useTimeoutWhen](https://rooks.vercel.app/docs/useTimeoutWhen) - Takes a callback and fires it when a condition is true
*   [useToggle](https://rooks.vercel.app/docs/useToggle) - Toggle (between booleans or custom data)hook for React.
*   [useVibrate](https://rooks.vercel.app/docs/useVibrate) - Vibration API hook for React
*   [useWhyDidYouUpdate](https://rooks.vercel.app/docs/useWhyDidYouUpdate) - A hook that can track which value change caused a rerender

**<h3 align="center">🚃 Navigator</h3>**

*   [useNavigatorLanguage](https://rooks.vercel.app/docs/useNavigatorLanguage) - Navigator Language hook for React.
*   [useOnline](https://rooks.vercel.app/docs/useOnline) - Online status hook for React.

**<h3 align="center">❇️ State</h3>**

*   [useArrayState](https://rooks.vercel.app/docs/useArrayState) - Array state manager hook for React
*   [useCountdown](https://rooks.vercel.app/docs/useCountdown) - Count down to a target timestamp and call callbacks every second (or provided peried)
*   [useCounter](https://rooks.vercel.app/docs/useCounter) - Counter hook for React.
*   [useGetIsMounted](https://rooks.vercel.app/docs/useGetIsMounted) - Checks if a component is mounted or not at the time. Useful for async effects
*   [useLocalstorageState](https://rooks.vercel.app/docs/useLocalstorageState) - UseState but auto updates values to localStorage
*   [useMapState](https://rooks.vercel.app/docs/useMapState) - A react hook to manage state in a key value pair map.
*   [useMultiSelectableList](https://rooks.vercel.app/docs/useMultiSelectableList) - A custom hook to easily select multiple values from a list
*   [useNativeMapState](https://rooks.vercel.app/docs/useNativeMapState) - Manage Map() object state in React
*   [usePreviousDifferent](https://rooks.vercel.app/docs/usePreviousDifferent) - usePreviousDifferent returns the last different value of a variable
*   [usePreviousImmediate](https://rooks.vercel.app/docs/usePreviousImmediate) - usePreviousImmediate returns the previous value of a variable even if it was the same or different
*   [usePromise](https://rooks.vercel.app/docs/usePromise) - Promise management hook for react
*   [useQueueState](https://rooks.vercel.app/docs/useQueueState) - A React hook that manages state in the form of a queue
*   [useSafeSetState](https://rooks.vercel.app/docs/useSafeSetState) - set state but ignores if component has already unmounted
*   [useSelect](https://rooks.vercel.app/docs/useSelect) - Select values from a list easily. List selection hook for react.
*   [useSelectableList](https://rooks.vercel.app/docs/useSelectableList) - Easily select a single value from a list of values. very useful for radio buttons, select inputs  etc.
*   [useSessionstorageState](https://rooks.vercel.app/docs/useSessionstorageState) - useState but syncs with sessionstorage
*   [useSetState](https://rooks.vercel.app/docs/useSetState) - Manage the state of a Set in React.
*   [useStackState](https://rooks.vercel.app/docs/useStackState) - A React hook that manages state in the form of a stack
*   [useTimeTravelState](https://rooks.vercel.app/docs/useTimeTravelState) - A hook that manages state which can undo and redo. A more powerful version of useUndoState hook.
*   [useUndoRedoState](https://rooks.vercel.app/docs/useUndoRedoState) - Setstate but can also undo and redo
*   [useUndoState](https://rooks.vercel.app/docs/useUndoState) - Drop in replacement for useState hook but with undo functionality.

**<h3 align="center">⚛️ UI</h3>**

*   [useAudio](https://rooks.vercel.app/docs/useAudio) - Audio hook
*   [useBoundingclientrect](https://rooks.vercel.app/docs/useBoundingclientrect) - getBoundingClientRect hook for React.
*   [useBoundingclientrectRef](https://rooks.vercel.app/docs/useBoundingclientrectRef) - A hook that tracks the boundingclientrect of an element. It returns a callbackRef so that the element node if changed is easily tracked.
*   [useFullscreen](https://rooks.vercel.app/docs/useFullscreen) - Use full screen api for making beautiful and emersive experinces.
*   [useGeolocation](https://rooks.vercel.app/docs/useGeolocation) - A hook to provide the geolocation info on client side.
*   [useInViewRef](https://rooks.vercel.app/docs/useInViewRef) - Simple hook that monitors element enters or leave the viewport that's using Intersection Observer API.
*   [useIntersectionObserverRef](https://rooks.vercel.app/docs/useIntersectionObserverRef) - A hook to register an intersection observer listener.
*   [useKey](https://rooks.vercel.app/docs/useKey) - keypress, keyup and keydown event handlers as hooks for react.
*   [useKeyBindings](https://rooks.vercel.app/docs/useKeyBindings) - useKeyBindings can bind multiple keys to multiple callbacks and fire the callbacks on key press.
*   [useKeyRef](https://rooks.vercel.app/docs/useKeyRef) - Very similar useKey but it returns a ref
*   [useKeys](https://rooks.vercel.app/docs/useKeys) - A hook which allows to setup callbacks when a combination of keys are pressed at the same time.
*   [useMediaMatch](https://rooks.vercel.app/docs/useMediaMatch) - Signal whether or not a media query is currently matched.
*   [useMouse](https://rooks.vercel.app/docs/useMouse) - Mouse position hook for React.
*   [useMutationObserver](https://rooks.vercel.app/docs/useMutationObserver) - Mutation Observer hook for React.
*   [useMutationObserverRef](https://rooks.vercel.app/docs/useMutationObserverRef) - A hook that tracks mutations of an element. It returns a callbackRef.
*   [useRaf](https://rooks.vercel.app/docs/useRaf) - A continuously running requestAnimationFrame hook for React
*   [useResizeObserverRef](https://rooks.vercel.app/docs/useResizeObserverRef) - Resize Observer hook for React.
*   [useVideo](https://rooks.vercel.app/docs/useVideo) - Video hook for react
*   [useWindowScrollPosition](https://rooks.vercel.app/docs/useWindowScrollPosition) - A React hook to get the scroll position of the window
*   [useWindowSize](https://rooks.vercel.app/docs/useWindowSize) - Window size hook for React.

<!--hookslist end-->

<br/>
<br/>

## Features

<!--hookscount start-->

✅ Collection of 91 hooks as standalone modules.

<!--hookscount end-->

✅ Standalone package with all the hooks at one place

✅ CommonJS, UMD and ESM Support

## Installation

    npm i -s rooks

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

[![All Contributors](https://img.shields.io/badge/all_contributors-63-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore-start -->

<!-- markdownlint-disable -->

<table>
  <tr>
    <td align="center"><a href="https://codewithbhargav.com/"><img src="https://avatars.githubusercontent.com/u/2936644?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bhargav Ponnapalli</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=imbhargav5" title="Code">💻</a> <a href="#maintenance-imbhargav5" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://simbathesailor.dev/"><img src="https://avatars.githubusercontent.com/u/5938110?v=4?s=100" width="100px;" alt=""/><br /><sub><b>anil kumar chaudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=simbathesailor" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/qiweiii"><img src="https://avatars.githubusercontent.com/u/32790369?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Qiwei Yang</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=qiweiii" title="Code">💻</a> <a href="#maintenance-qiweiii" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/maciekgrzybek"><img src="https://avatars.githubusercontent.com/u/16546428?v=4?s=100" width="100px;" alt=""/><br /><sub><b>maciek_grzybek</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=maciekgrzybek" title="Code">💻</a></td>
    <td align="center"><a href="https://foobars.in/"><img src="https://avatars.githubusercontent.com/u/5774849?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Harsh Zalavadiya</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=harshzalavadiya" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mahijendra"><img src="https://avatars.githubusercontent.com/u/39908767?v=4?s=100" width="100px;" alt=""/><br /><sub><b>B V K MAHIJENDRA </b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mahijendra" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/braxtonchristensen"><img src="https://avatars.githubusercontent.com/u/11494223?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Braxton Christensen</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=braxtonchristensen" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/hanselabreu"><img src="https://avatars.githubusercontent.com/u/27902567?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hansel</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=hanselabreu" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/harshilparmar"><img src="https://avatars.githubusercontent.com/u/45915468?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Harshil Parmar</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=harshilparmar" title="Code">💻</a></td>
    <td align="center"><a href="https://elrumordelaluz.com/"><img src="https://avatars.githubusercontent.com/u/784056?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lionel</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=elrumordelaluz" title="Code">💻</a></td>
    <td align="center"><a href="https://mxstbr.com/"><img src="https://avatars.githubusercontent.com/u/7525670?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Max Stoiber</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mxstbr" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mscottmoore"><img src="https://avatars.githubusercontent.com/u/5983927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Moore</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mscottmoore" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ChocolateLoverRaj"><img src="https://avatars.githubusercontent.com/u/52586855?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rajas Paranjpe</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ChocolateLoverRaj" title="Code">💻</a></td>
    <td align="center"><a href="http://pka.netlify.app/"><img src="https://avatars.githubusercontent.com/u/31067376?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mahendra Choudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=iampika" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/phmngocnghia"><img src="https://avatars.githubusercontent.com/u/36730355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nghia Pham</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=phmngocnghia" title="Code">💻</a></td>
    <td align="center"><a href="https://www.twitter.com/deadcoder0904"><img src="https://avatars.githubusercontent.com/u/16436270?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akshay Kadam (A2K)</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=deadcoder0904" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alex-golubtsov"><img src="https://avatars.githubusercontent.com/u/1982853?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Golubtsov</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=alex-golubtsov" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Armanio"><img src="https://avatars.githubusercontent.com/u/3195714?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arman</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=Armanio" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrvisser"><img src="https://avatars.githubusercontent.com/u/102265?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Branden Visser</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mrvisser" title="Code">💻</a></td>
    <td align="center"><a href="http://3dgo.net/"><img src="https://avatars.githubusercontent.com/u/1618956?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brian Steere</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=Dianoga" title="Code">💻</a></td>
    <td align="center"><a href="https://www.calcourtney.net/"><img src="https://avatars.githubusercontent.com/u/30095183?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cal Courtney</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=calthejuggler" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/chrismilson"><img src="https://avatars.githubusercontent.com/u/13655076?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Milson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=chrismilson" title="Code">💻</a></td>
    <td align="center"><a href="http://zhihu.com/people/dancerphil"><img src="https://avatars.githubusercontent.com/u/7264444?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cong Zhang</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dancerphil" title="Code">💻</a></td>
    <td align="center"><a href="http://danielholmes.org/"><img src="https://avatars.githubusercontent.com/u/349833?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Holmes</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=danielholmes" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/febeck"><img src="https://avatars.githubusercontent.com/u/12020091?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fernando Beck</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=febeck" title="Code">💻</a></td>
    <td align="center"><a href="http://www.joshdavenport.co.uk/"><img src="https://avatars.githubusercontent.com/u/757828?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh Davenport</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=joshdavenport" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/1337MARCEL"><img src="https://avatars.githubusercontent.com/u/16888873?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MARCEL</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=1337MARCEL" title="Code">💻</a></td>
    <td align="center"><a href="https://neilor.facss.io/"><img src="https://avatars.githubusercontent.com/u/4008023?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neilor Caldeira</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=neilor" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://tobi.sh/"><img src="https://avatars.githubusercontent.com/u/2978876?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tobias Lins</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=tobiaslins" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fintara"><img src="https://avatars.githubusercontent.com/u/4290594?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tsvetan</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=fintara" title="Code">💻</a></td>
    <td align="center"><a href="http://twitter.com/yesmeck"><img src="https://avatars.githubusercontent.com/u/465125?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wei Zhu</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=yesmeck" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yakkomajuri"><img src="https://avatars.githubusercontent.com/u/38760734?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yakko Majuri</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=yakkomajuri" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fhellwig"><img src="https://avatars.githubusercontent.com/u/1703592?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Frank Hellwig</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=fhellwig" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/theskillwithin"><img src="https://avatars.githubusercontent.com/u/8095506?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Austin Peterson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=theskillwithin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/thodubois"><img src="https://avatars.githubusercontent.com/u/37809039?v=4?s=100" width="100px;" alt=""/><br /><sub><b>thodubois</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=thodubois" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/weschristiansen"><img src="https://avatars.githubusercontent.com/u/5215218?v=4?s=100" width="100px;" alt=""/><br /><sub><b>wes christiansen</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=weschristiansen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/cjpatoilo"><img src="https://avatars.githubusercontent.com/u/1542831?v=4?s=100" width="100px;" alt=""/><br /><sub><b>CJ Patoilo</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=cjpatoilo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mar1u50"><img src="https://avatars.githubusercontent.com/u/17710919?v=4?s=100" width="100px;" alt=""/><br /><sub><b>mar1u50</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mar1u50" title="Code">💻</a></td>
    <td align="center"><a href="https://ayushman.me/"><img src="https://avatars.githubusercontent.com/u/38486014?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ayushman Gupta</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ayushman-git" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/RafaelFerreiraTVD"><img src="https://avatars.githubusercontent.com/u/15105462?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rafael Ferreira</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=RafaelFerreiraTVD" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/krijoh92"><img src="https://avatars.githubusercontent.com/u/1156014?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kristinn Thor Johannsson</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=krijoh92" title="Code">💻</a></td>
    <td align="center"><a href="https://michaelmakes.games/"><img src="https://avatars.githubusercontent.com/u/5983927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Moore</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=MichaelMakesGames" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://trevorblades.com/"><img src="https://avatars.githubusercontent.com/u/1216917?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Trevor Blades</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=trevorblades" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrdulin"><img src="https://avatars.githubusercontent.com/u/17866683?v=4?s=100" width="100px;" alt=""/><br /><sub><b>official_dulin</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=mrdulin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/billymosis"><img src="https://avatars.githubusercontent.com/u/57342180?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Billy Mosis Priambodo</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=billymosis" title="Code">💻</a></td>
    <td align="center"><a href="http://staffordwilliams.com/"><img src="https://avatars.githubusercontent.com/u/6289998?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stafford Williams</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=staff0rd" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/superLipbalm"><img src="https://avatars.githubusercontent.com/u/77329061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chanhee Kim</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=superLipbalm" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hooriza"><img src="https://avatars.githubusercontent.com/u/507927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hooriza</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=hooriza" title="Code">💻</a></td>
    <td align="center"><a href="https://nilsw.io/"><img src="https://avatars.githubusercontent.com/u/1405318?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nils Wittler</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=nlswtlr" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/sszczep"><img src="https://avatars.githubusercontent.com/u/21238816?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastian Szczepański</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=sszczep" title="Code">💻</a></td>
    <td align="center"><a href="http://pka.netlify.app/"><img src="https://avatars.githubusercontent.com/u/31067376?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mahendra Choudhary</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=pikaatic" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ssmkhrj"><img src="https://avatars.githubusercontent.com/u/49264891?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Som Shekhar Mukherjee</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=ssmkhrj" title="Code">💻</a></td>
    <td align="center"><a href="https://qpan.dev/"><img src="https://avatars.githubusercontent.com/u/17402261?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Qiushi Pan</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=qqpann" title="Code">💻</a></td>
    <td align="center"><a href="http://jishnu.me/"><img src="https://avatars.githubusercontent.com/u/754818?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jishnu Viswanath</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=neolivz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/brahambence"><img src="https://avatars.githubusercontent.com/u/11694244?v=4?s=100" width="100px;" alt=""/><br /><sub><b>brahambence</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=brahambence" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dependabot[bot]" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/apps/renovate"><img src="https://avatars.githubusercontent.com/in/2740?v=4?s=100" width="100px;" alt=""/><br /><sub><b>renovate[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=renovate[bot]" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/apps/dependabot-preview"><img src="https://avatars.githubusercontent.com/in/2141?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dependabot-preview[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=dependabot-preview[bot]" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4?s=100" width="100px;" alt=""/><br /><sub><b>github-actions[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=github-actions[bot]" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt=""/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=allcontributors[bot]" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/zhangenming"><img src="https://avatars.githubusercontent.com/u/21235555?v=4?s=100" width="100px;" alt=""/><br /><sub><b>zhangenming</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=zhangenming" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/akiszka"><img src="https://avatars.githubusercontent.com/u/30828906?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Antoni Kiszka</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=akiszka" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/gpoole_is_taken"><img src="https://avatars.githubusercontent.com/u/2898433?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Greg Poole</b></sub></a><br /><a href="https://github.com/imbhargav5/rooks/commits?author=gpoole" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
