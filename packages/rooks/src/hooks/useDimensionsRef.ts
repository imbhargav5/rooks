 
/**
 *  Inspired from https://github.com/Swizec/useDimensions
 *
 */
import { useState, useCallback, useLayoutEffect } from "react";
import type { LegacyRef } from "react";
import { useOnWindowResize } from "./useOnWindowResize";
import { useOnWindowScroll } from "./useOnWindowScroll";

type UseDimensionsRefReturn = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
} | null;

type UseDimensionsHook = [
  LegacyRef<HTMLDivElement> | undefined,
  UseDimensionsRefReturn,
  HTMLElement | null
];

type UseDimensionsRefArgs = {
  updateOnResize?: boolean;
  updateOnScroll?: boolean;
};
const getDimensionObject = (node: HTMLElement): UseDimensionsRefReturn => {
  const rect = node.getBoundingClientRect();

  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.left,
    y: rect.top,
  };
};

const noWindowReturnValue: UseDimensionsHook = [undefined, null, null];

/**
 * useDimensionsRef
 * @param updateOnScroll Whether to update on scroll
 * @param updateOnResize Whether to update on resize
 * @returns [React.Ref<HTMLDivElement>, UseDimensionsRefReturn, HTMLElement | null]
 * @see https://rooks.vercel.app/docs/hooks/useDimensionsRef
 */
export const useDimensionsRef = ({
  updateOnScroll = true,
  updateOnResize = true,
}: UseDimensionsRefArgs = {}): UseDimensionsHook => {
  const [dimensions, setDimensions] = useState<UseDimensionsRefReturn>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((nodeFromCallback: HTMLElement | null) => {
    setNode(nodeFromCallback);
  }, []);

  const measure = useCallback(() => {
    window.requestAnimationFrame(() => {
      if (node) {
        setDimensions(getDimensionObject(node));
      }
    });
  }, [node]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useOnWindowResize(
    () => {
      measure();
    },
    updateOnResize,
    true
  );

  useOnWindowScroll(
    () => {
      measure();
    },
    updateOnScroll,
    true
  );

  if (typeof window === "undefined") {
    console.warn("useDimensionsRef: window is undefined.");

    return noWindowReturnValue;
  }

  return [ref, dimensions, node];
};
