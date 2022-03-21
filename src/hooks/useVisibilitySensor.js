"use strict";
// Massive respect for Josh Johnston
// A lot of the logic is taken from his repo -> https://github.com/joshwnj/react-visibility-sensor
// And is rewritten for hooks api
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVisibilitySensor = void 0;
var react_1 = require("react");
var useIsomorphicEffect_1 = require("./useIsomorphicEffect");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
function normalizeRect(rect) {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left;
  }
  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top;
  }
  return rect;
}
var initialState = { isVisible: null, visibilityRect: {} };
function reducer(state, action) {
  switch (action.type) {
    case "set":
      if (state.isVisible === action.payload.isVisible) {
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}
var DEFAULT_OPTIONS = {
  containment: null,
  intervalCheck: false,
  minTopValue: 0,
  partialVisibility: false,
  resizeCheck: false,
  resizeDebounce: 250,
  resizeThrottle: -1,
  scrollCheck: true,
  scrollDebounce: 250,
  scrollThrottle: -1,
  shouldCheckOnMount: true,
};
/**
 * useVisibilitySensor hook
 * Tracks the visibility of a ref
 *
 * @param ref The ref to track visibility of
 * @param opts Options
 */
function useVisibilitySensor(ref, options) {
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "useVisibilitySensor is deprecated, it will be removed in rooks v7. Please use useInViewRef instead."
  );
  /*
        Create local state
      */
  var _a = (0, react_1.useReducer)(reducer, initialState),
    localState = _a[0],
    dispatch = _a[1];
  /*
        Get options
      */
  var _b = Object.assign({}, DEFAULT_OPTIONS, options),
    containment = _b.containment,
    intervalCheck = _b.intervalCheck,
    scrollCheck = _b.scrollCheck,
    shouldCheckOnMount = _b.shouldCheckOnMount,
    scrollDebounce = _b.scrollDebounce,
    scrollThrottle = _b.scrollThrottle,
    resizeCheck = _b.resizeCheck,
    resizeDebounce = _b.resizeDebounce,
    resizeThrottle = _b.resizeThrottle,
    partialVisibility = _b.partialVisibility,
    minTopValue = _b.minTopValue;
  function getContainer() {
    return containment || window;
  }
  /*
        Check visibility
      */
  function checkVisibility() {
    var containmentRect;
    if (containment) {
      var containmentDOMRect = containment.getBoundingClientRect();
      containmentRect = {
        bottom: containmentDOMRect.bottom,
        left: containmentDOMRect.left,
        right: containmentDOMRect.right,
        top: containmentDOMRect.top,
      };
    } else {
      containmentRect = {
        bottom: window.innerHeight || document.documentElement.clientHeight,
        left: 0,
        right: window.innerWidth || document.documentElement.clientWidth,
        top: 0,
      };
    }
    var rect = normalizeRect(ref.current.getBoundingClientRect());
    var hasSize = rect.height > 0 && rect.width > 0;
    var visibilityRect = {
      bottom: rect.bottom <= containmentRect.bottom,
      left: rect.left >= containmentRect.left,
      right: rect.right <= containmentRect.right,
      top: rect.top >= containmentRect.top,
    };
    var isVisible =
      hasSize &&
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right;
    // check for partial visibility
    if (hasSize && partialVisibility) {
      var partialVisible =
        rect.top <= containmentRect.bottom &&
        rect.bottom >= containmentRect.top &&
        rect.left <= containmentRect.right &&
        rect.right >= containmentRect.left;
      // account for partial visibility on a single edge
      if (typeof partialVisibility === "string") {
        partialVisible = visibilityRect[partialVisibility];
      }
      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      isVisible = minTopValue
        ? partialVisible && rect.top <= containmentRect.bottom - minTopValue
        : partialVisible;
    }
    return { isVisible: isVisible, visibilityRect: visibilityRect };
  }
  function updateIsVisible() {
    if (!ref.current) {
      return;
    }
    var _a = checkVisibility(),
      isVisible = _a.isVisible,
      visibilityRect = _a.visibilityRect;
    dispatch({
      payload: { isVisible: isVisible, visibilityRect: visibilityRect },
      type: "set",
    });
  }
  // run only once, hence empty array as second argument
  (0, react_1.useEffect)(function () {
    if (shouldCheckOnMount) {
      updateIsVisible();
    }
  }, []);
  (0, react_1.useEffect)(
    function () {
      updateIsVisible();
    },
    [ref.current]
  );
  // If interval check is needed
  (0, react_1.useEffect)(
    function () {
      if (intervalCheck && intervalCheck > 0) {
        var intervalTimer_1 = setInterval(function () {
          updateIsVisible();
        }, intervalCheck);
        return function () {
          clearInterval(intervalTimer_1);
        };
      }
    },
    [intervalCheck]
  );
  function createListener(event, debounce, throttle) {
    var container = getContainer();
    var timeout;
    var listener;
    var later = function () {
      timeout = null;
      updateIsVisible();
    };
    if (throttle > -1) {
      listener = function () {
        if (!timeout) {
          timeout = setTimeout(later, throttle || 0);
        }
      };
    } else {
      listener = function () {
        clearTimeout(timeout);
        timeout = setTimeout(later, debounce || 0);
      };
    }
    container.addEventListener(event, listener);
    return function () {
      clearTimeout(timeout);
      container.removeEventListener(event, listener);
    };
  }
  // If scroll check is needed
  (0, useIsomorphicEffect_1.useIsomorphicEffect)(function () {
    if (scrollCheck) {
      return createListener("scroll", scrollDebounce, scrollThrottle);
    }
  }, []);
  // if resize check is needed
  (0, useIsomorphicEffect_1.useIsomorphicEffect)(function () {
    if (resizeCheck) {
      return createListener("resize", resizeDebounce, resizeThrottle);
    }
  }, []);
  return localState;
}
exports.useVisibilitySensor = useVisibilitySensor;
