import { Ref } from "react";

type Options = {
  intervalCheck: boolean | number;
  partialVisibility: boolean | string;
  containment: HTMLElement | null;
  scrollCheck: boolean;
  scrollDebounce: number;
  scrollThrottle: number;
  resizeCheck: boolean;
  resizeDebounce: number;
  resizeThrottle: number;
  shouldCheckOnMount: boolean;
  minTopValue: number;
};

type VisibilityRect = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};

interface State {
  isVisible: boolean;
  visibilityRect: VisibilityRect;
}

export default function useVisibilitySensor(
  ref: Ref<HTMLElement>,
  options?: Partial<Options>
): State;
