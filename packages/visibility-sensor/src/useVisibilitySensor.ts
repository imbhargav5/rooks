// Massive respect for Josh Johnston
// A lot of the logic is taken from his repo -> https://github.com/joshwnj/react-visibility-sensor
// And is rewritten for hooks api

import { useEffect, useReducer, useLayoutEffect } from "react";

function normalizeRect(rect) {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left;
  }

  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top;
  }

  return rect;
}

const initialState = { isVisible: null, visibilityRect: {} };

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

const DEFAULT_OPTIONS = {
  intervalCheck: false,
  partialVisibility: false,
  containment: null,
  scrollCheck: true,
  scrollDebounce: 250,
  scrollThrottle: -1,
  resizeCheck: false,
  resizeDebounce: 250,
  resizeThrottle: -1,
  shouldCheckOnMount: true,
  minTopValue: 0
};

function useVisbilitySensor(ref, opts) {
  /*
      Create local state
    */
  const [localState, dispatch] = useReducer(reducer, initialState);

  /*
      Get options
    */
  const {
    containment,
    intervalCheck,
    scrollCheck,
    shouldCheckOnMount,
    scrollDebounce,
    scrollThrottle,
    resizeCheck,
    resizeDebounce,
    resizeThrottle,
    partialVisibility,
    minTopValue
  } = (<any>Object).assign({}, DEFAULT_OPTIONS, opts);

  function getContainer() {
    return containment || window;
  }

  /*
      Check visibility
    */
  function checkVisibility() {
    console.log("checking visibility");
    let containmentRect;
    if (containment && ref.current) {
      const containmentDOMRect = containment.getBoundingClientRect();
      containmentRect = {
        top: containmentDOMRect.top,
        left: containmentDOMRect.left,
        bottom: containmentDOMRect.bottom,
        right: containmentDOMRect.right
      };
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
    }

    const rect = normalizeRect(ref.current.getBoundingClientRect());
    const hasSize = rect.height > 0 && rect.width > 0;

    const visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    let isVisible =
      hasSize &&
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right;

    // check for partial visibility
    if (hasSize && partialVisibility) {
      let partialVisible =
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
    return { isVisible, visibilityRect };
  }

  function updateIsVisible() {
    const { isVisible, visibilityRect } = checkVisibility();
    dispatch({
      type: "set",
      payload: { isVisible, visibilityRect }
    });
  }

  // run only once, hence empty array as second argument
  useEffect(() => {
    if (shouldCheckOnMount) {
      updateIsVisible();
    }
  }, []);

  // If interval check is needed
  useEffect(() => {
    if (intervalCheck && intervalCheck > 0) {
      const intervalTimer = setInterval(() => {
        updateIsVisible();
      }, intervalCheck);
      return () => {
        clearInterval(intervalTimer);
      };
    }
  }, [intervalCheck]);

  function createListener(event, debounce, throttle) {
    const container = getContainer();
    let timeout;
    let listener;
    const later = () => {
      timeout = null;
      updateIsVisible();
    };
    if (throttle > -1) {
      listener = () => {
        if (!timeout) {
          timeout = setTimeout(later, throttle || 0);
        }
      };
    } else {
      listener = () => {
        clearTimeout(timeout);
        timeout = setTimeout(later, debounce || 0);
      };
    }
    container.addEventListener(event, listener);
    return () => {
      clearTimeout(timeout);
      container.removeEventListener(event, listener);
    };
  }

  // If scroll check is needed
  useLayoutEffect(() => {
    if (scrollCheck) {
      return createListener("scroll", scrollDebounce, scrollThrottle);
    }
  }, []);

  // if resize check is needed

  useLayoutEffect(() => {
    if (resizeCheck) {
      return createListener("resize", resizeDebounce, resizeThrottle);
    }
  }, []);
  return localState;
}
export { useVisbilitySensor };
