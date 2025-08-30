import { noop } from "@/utils/noop";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CallbackRef, HTMLElementOrNull } from "../utils/utils";
import { useDebounceFn } from "./useDebounceFn";

/**
 * Options for the useMeasure hook
 */
export interface UseMeasureOptions {
  /**
   * Number of milliseconds to debounce measurements (default: 0)
   */
  debounce?: number;
  /**
   * Whether measurements are disabled (default: false)
   */
  disabled?: boolean;
  /**
   * Callback function called when dimensions change
   */
  onMeasure?: (measurements: UseMeasurements) => void;
}

/**
 * Measurement data returned by useMeasure
 */
export interface UseMeasurements {
  /**
   * Inner width (clientWidth) - content area width excluding scrollbars
   */
  innerWidth: number;
  /**
   * Inner height (clientHeight) - content area height excluding scrollbars
   */
  innerHeight: number;
  /**
   * Total scrollable width (scrollWidth) - width of the entire content area
   */
  innerScrollWidth: number;
  /**
   * Total scrollable height (scrollHeight) - height of the entire content area
   */
  innerScrollHeight: number;
  /**
   * Outer width (offsetWidth) - element width including padding, border, and scrollbars
   */
  outerWidth: number;
  /**
   * Outer height (offsetHeight) - element height including padding, border, and scrollbars
   */
  outerHeight: number;
  /**
   * Outer scrollable width (scrollWidth) - total width of scrollable content
   */
  outerScrollWidth: number;
  /**
   * Outer scrollable height (scrollHeight) - total height of scrollable content
   */
  outerScrollHeight: number;
}

/**
 * Return type of useMeasure hook - tuple with [ref, measurements]
 */
export type UseMeasureReturn = [
  /**
   * Callback ref to attach to the DOM element you want to measure
   */
  CallbackRef,
  /**
   * Object containing all measurement data
   */
  UseMeasurements
];

const defaultMeasurements: UseMeasurements = {
  innerWidth: 0,
  innerHeight: 0,
  innerScrollWidth: 0,
  innerScrollHeight: 0,
  outerWidth: 0,
  outerHeight: 0,
  outerScrollWidth: 0,
  outerScrollHeight: 0,
};

/**
 * Get inner measurements from a DOM element
 * @param element - The DOM element to measure
 * @returns Measurement object with inner dimensions
 */
function getMeasurements(element: HTMLElement): UseMeasurements {
  return {
    innerWidth: element.clientWidth,
    innerHeight: element.clientHeight,
    innerScrollWidth: element.scrollWidth,
    innerScrollHeight: element.scrollHeight,
    outerWidth: element.offsetWidth,
    outerHeight: element.offsetHeight,
    outerScrollWidth: element.scrollWidth,
    outerScrollHeight: element.scrollHeight,
  };
}

/**
 * useMeasure hook
 *
 * Measures both inner and outer dimensions of any DOM element in a performant way
 * and updates when dimensions change. Uses ResizeObserver for efficient
 * size change detection.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing ref and measurement data
 * @see https://rooks.vercel.app/docs/hooks/useMeasure
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [ref, { innerWidth, innerHeight, innerScrollWidth, innerScrollHeight }] = useMeasure();
 *   
 *   return (
 *     <div ref={ref}>
 *       <p>Inner dimensions: {innerWidth} x {innerHeight}</p>
 *       <p>Scroll dimensions: {innerScrollWidth} x {innerScrollHeight}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With debouncing and callback
 * function MyComponent() {
 *   const [ref, measurements] = useMeasure({
 *     debounce: 100,
 *     onMeasure: (measurements) => {
 *       console.log('Dimensions changed:', measurements);
 *     }
 *   });
 *   
 *   return <div ref={ref}>Content here</div>;
 * }
 * ```
 */
function useMeasure(
  options: UseMeasureOptions = {}
): UseMeasureReturn {
  const { debounce = 0, disabled = false, onMeasure } = options;
  const [node, setNode] = useState<HTMLElementOrNull>(null);
  const [measurements, setMeasurements] = useState<UseMeasurements>(
    defaultMeasurements
  );
  const onMeasureRef = useRef(onMeasure);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Keep onMeasure callback fresh
  useEffect(() => {
    onMeasureRef.current = onMeasure;
  });

  // Measure function that gets the current dimensions
  const measure = useCallback(() => {
    if (!node || disabled) {
      return;
    }

    const newMeasurements = getMeasurements(node);
    setMeasurements(newMeasurements);
    
    if (onMeasureRef.current) {
      onMeasureRef.current(newMeasurements);
    }
  }, [node, disabled]);

  // Debounced measure function if debounce is enabled
  const [debouncedMeasure] = useDebounceFn(measure, debounce, {
    leading: false,
    trailing: true,
  });

  const measureFunction = debounce > 0 ? debouncedMeasure : measure;

  // ResizeObserver callback
  const handleResizeObserver = useCallback<ResizeObserverCallback>(
    () => {
      measureFunction();
    },
    [measureFunction]
  );

  // Set up ResizeObserver when node changes
  useEffect(() => {
    if (!node || disabled) {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      return noop;
    }

    // Check if ResizeObserver is available (SSR safety)
    if (typeof ResizeObserver === "undefined") {
      console.warn(
        "useMeasure: ResizeObserver is not available in this environment"
      );
      return noop;
    }

    // Create ResizeObserver
    const observer = new ResizeObserver(handleResizeObserver);
    resizeObserverRef.current = observer;

    // Start observing with content-box to track inner content changes
    observer.observe(node, { box: "content-box" });

    // Initial measurement
    measureFunction();

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;
    };
  }, [node, disabled, handleResizeObserver, measureFunction]);

  // Callback ref
  const ref: CallbackRef = useCallback(
    (element: HTMLElementOrNull) => {
      setNode(element);
    },
    []
  );

  // Handle SSR case
  useEffect(() => {
    if (typeof window === "undefined") {
      console.warn("useMeasure: window is undefined (SSR environment)");
    }
  }, []);

  return [ref, measurements];
}

export { useMeasure };