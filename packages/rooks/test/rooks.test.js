"use strict";

import {
  useBoundingclientrect,
  useCounter,
  useDebounce,
  useDidMount,
  useDidUpdate,
  useGeolocation,
  useInput,
  useInterval,
  useKey,
  useKeys,
  useLocalstorage,
  useModal,
  useMouse,
  useMutationObserver,
  useNavigatorLanguage,
  useOnWindowResize,
  useOnWindowScroll,
  useOnline,
  useOutsideClick,
  usePrevious,
  useRaf,
  useSelect,
  useSessionstorage,
  useThrottle,
  useTimeAgo,
  useTimeout,
  useToggle,
  useVisibilitySensor,
  useWillUnmount,
  useWindowSize,
  useWorker
} from "..";

describe("rooks", () => {
  it("has modules", () => {
    const rooksPackages = [
      useBoundingclientrect,
      useCounter,
      useDebounce,
      useDidMount,
      useDidUpdate,
      useGeolocation,
      useInput,
      useInterval,
      useKey,
      useKeys,
      useLocalstorage,
      useModal,
      useMouse,
      useMutationObserver,
      useNavigatorLanguage,
      useOnWindowResize,
      useOnWindowScroll,
      useOnline,
      useOutsideClick,
      usePrevious,
      useRaf,
      useSelect,
      useSessionstorage,
      useThrottle,
      useTimeAgo,
      useTimeout,
      useToggle,
      useVisibilitySensor,
      useWillUnmount,
      useWindowSize,
      useWorker
    ];

    rooksPackages.forEach(rooksPackage => {
      expect(rooksPackage).toBeDefined();
    });
  });
});
