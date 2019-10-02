import { useEffect, useLayoutEffect } from "react";

/**
 *
 * @param {function} callback Callback function to be called on mount
 */

const useIsomorphicEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export { useIsomorphicEffect };
