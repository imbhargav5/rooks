/* eslint-disable id-length */
/**
 *  Inspired from https://github.com/Swizec/useDimensions

 **/
import { useState, useCallback, useLayoutEffect } from "react";
import type { LegacyRef } from "react";
import { useOnWindowResize } from "./useOnWindowResize";
import { useOnWindowScroll } from "./useOnWindowScroll";

type UseDimensionsRefReturn = {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
} | null;

type UseDimensionsHook = [
  LegacyRef<HTMLDivElement> | undefined,
  UseDimensionsRefReturn,
  HTMLElement | null
];

type UseDimensionsRefArgs = {
  updateOnScroll?: boolean;
  updateOnResize?: boolean;
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

export const useDimensionsRef = ({
  updateOnScroll = true,
  updateOnResize = true,
}: UseDimensionsRefArgs = {}): UseDimensionsHook => {
  const [dimensions, setDimensions] = useState<UseDimensionsRefReturn>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((nodeFromCallback) => {
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

  return [ref, dimensions, node];
};
