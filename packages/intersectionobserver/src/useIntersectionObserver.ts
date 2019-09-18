import * as React from "react";
import { useDidMount } from "shared/useDidMount";

const initialState = {
  intersectionObj: {},
  observerInState: null,
  isVisible: false
};

interface Iaction {
  type: string;
  data: any;
}

function IntersectionObserverReducer(state: any, action: Iaction) {
  switch (action.type) {
    case "SETINTERSECTIONOBJ": {
      return {
        ...state,
        intersectionObj: action.data
      };
    }
    case "SETOBSERVERHANDLE": {
      return {
        ...state,
        observerInState: action.data
      };
    }
    case "SET_VISIBILITY": {
      return {
        ...state,
        isVisible: action.data
      };
    }
  }
}

const checkFeasibility = () => {
  let MyWindow = window as any;
  if (!MyWindow || !MyWindow.IntersectionObserver) {
    console.warn(
      "Intersection Observer is not supported in the current browser / environment"
    );
    return false;
  }
  return true;
};
interface IOptions {
  root: HTMLElement;
  rootMargin?: string;
  threshold?: number[];
  when?: boolean;
  callback?: Function;
  visibilityCondition?: (entry: IntersectionObserverEntry) => boolean;
}

type useIntersectionObserverReturn = [
  (node: HTMLElement) => void,
  boolean,
  IntersectionObserverEntry,
  IntersectionObserver
];

/***
 * To use the the intersection Observer
 * visibiltyCondition call back can sent , which will be having access to
 * intersection entry object
 * Read https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * about various attributes provided by entries
 * Each entry describes an intersection change for one observed
 *  target element:
 *  entry.boundingClientRect
 *  entry.intersectionRatio
 *  entry.intersectionRect
 *  entry.isIntersecting
 *  entry.rootBounds
 *  entry.target
 *  entry.time
 */
const defaultVisibilityCondition = (entry: IntersectionObserverEntry) => {
  if (entry.intersectionRatio >= 1) {
    return true;
  }
  return false;
};

function useIntersectionObserver(
  options: IOptions
): useIntersectionObserverReturn {
  const defaultOptions = {
    rootMargin: "0px 0px 0px 0px",
    threshold: [0, 1],
    when: true,
    visibilityCondition: defaultVisibilityCondition
  };

  const {
    root = null,
    rootMargin,
    threshold,
    when,
    callback,
    visibilityCondition
  } = { ...defaultOptions, ...options };

  const [element, setElement] = React.useState<HTMLElement>(null);

  const [state, dispatch] = React.useReducer(
    IntersectionObserverReducer,
    initialState
  );
  const { intersectionObj, observerInState, isVisible } = state;
  const observerRef = React.useRef(null);
  const savedCallbackRef = React.useRef(callback);
  const visibilityConditionRef = React.useRef(visibilityCondition);

  React.useEffect(() => {
    visibilityConditionRef.current = visibilityCondition;
  });
  React.useEffect(() => {
    savedCallbackRef.current = callback;
  });

  useDidMount(() => {
    checkFeasibility();
  });

  /**
   * Setting callback Ref
   */

  const handleIntersectionObserve = React.useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        // setIntersectionObj(entry);
        dispatch({
          type: "SETINTERSECTIONOBJ",
          data: entry
        });
        if (!observerInState) {
          dispatch({
            type: "SETOBSERVERHANDLE",
            data: observer
          });
          // setObserver(observer);
        }
        const _visibilityFn =
          visibilityConditionRef.current || defaultVisibilityCondition;
        dispatch({
          type: "SET_VISIBILITY",
          data: _visibilityFn(entry)
        });

        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
      });
      savedCallbackRef.current && savedCallbackRef.current();
    },
    [observerInState]
  );

  /**
   * Effect responsible for creating intersection observer and
   * registering the observer for specific element
   */
  React.useEffect(() => {
    if (when) {
      const observer = new IntersectionObserver(handleIntersectionObserve, {
        root,
        threshold,
        rootMargin
      });
      observerRef.current = observer;
      if (element && observerRef.current) {
        observerRef.current.observe(element);
        return () => {
          if (element && observerRef.current) {
            observerRef.current.unobserve(element);
          }
        };
      }
    }
  }, [rootMargin, when, savedCallbackRef, threshold]);

  const callbackRef = React.useCallback((node: HTMLElement) => {
    setElement(node);
  }, []);

  return [callbackRef, isVisible, intersectionObj, observerInState];
}

export { useIntersectionObserver };
