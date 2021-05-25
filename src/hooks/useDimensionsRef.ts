/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useLayoutEffect, useState } from 'react';

type DimensionObjectType = {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
};

type UseDimensionsHookType = [
  (node: HTMLElement) => void,
  DimensionObjectType | {},
  HTMLElement | null
];

/**
 * useDimensionsRef
 * A React Hook to measure DOM nodes
 *
 * @param liveMeasure
 */
const useDimensionsRef = (
  liveMeasure: boolean = true
): UseDimensionsHookType => {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState<any>(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (node) {
        window.requestAnimationFrame(() => {
          const rect = node.getBoundingClientRect();

          const dimensionObject = {
            bottom: rect.bottom,
            height: rect.height,
            left: 'y' in rect ? rect.y : rect.left,
            right: rect.right,
            top: 'x' in rect ? rect.x : rect.top,
            width: rect.width,
            x: 'x' in rect ? rect.x : rect.left,
            y: 'y' in rect ? rect.y : rect.top,
          };

          setDimensions(dimensionObject);
        });
      }
    };

    measure();

    if (liveMeasure) {
      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure);
    }

    return () => {
      if (liveMeasure) {
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure);
      }
    };
  }, [node, liveMeasure]);

  return [ref, dimensions, node];
};

export { useDimensionsRef };
