import { useRef } from "react";

/**
 * useRenderCount
 * @description Get the render count of a component
 * @see {@link https://rooks.vercel.app/docs/hooks/useRenderCount}
 */
function useRenderCount(): number {
  return ++useRef<number>(0).current;
}

export { useRenderCount };
