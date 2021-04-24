// Massive respect for Josh Johnston
// A lot of the logic is taken from his repo -> https://github.com/joshwnj/react-visibility-sensor
// And is rewritten for hooks api

import { useEffect, useReducer, useLayoutEffect } from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';

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
    case 'set':
      if (state.isVisible === action.payload.isVisible) {
        return state;
      }

      return action.payload;
    default:
      return state;
  }
}

const DEFAULT_OPTIONS = {
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
    minTopValue,
  } = (<any>Object).assign({}, DEFAULT_OPTIONS, options);

  function getContainer() {
    return containment || window;
  }

  /*
      Check visibility
    */
  function checkVisibility() {
    let containmentRect;
    if (containment) {
      const containmentDOMRect = containment.getBoundingClientRect();
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

    const rect = normalizeRect(ref.current.getBoundingClientRect());
    const hasSize = rect.height > 0 && rect.width > 0;

    const visibilityRect = {
      bottom: rect.bottom <= containmentRect.bottom,
      left: rect.left >= containmentRect.left,
      right: rect.right <= containmentRect.right,
      top: rect.top >= containmentRect.top,
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
      if (typeof partialVisibility === 'string') {
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
    if (!ref.current) {
      return;
    }
    const { isVisible, visibilityRect } = checkVisibility();
    dispatch({
      payload: { isVisible, visibilityRect },
      type: 'set',
    });
  }

  // run only once, hence empty array as second argument
  useEffect(() => {
    if (shouldCheckOnMount) {
      updateIsVisible();
    }
  }, []);

  useEffect(() => {
    updateIsVisible();
  }, [ref.current]);

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
  useIsomorphicEffect(() => {
    if (scrollCheck) {
      return createListener('scroll', scrollDebounce, scrollThrottle);
    }
  }, []);

  // if resize check is needed

  useIsomorphicEffect(() => {
    if (resizeCheck) {
      return createListener('resize', resizeDebounce, resizeThrottle);
    }
  }, []);

  return localState;
}
export { useVisibilitySensor };
