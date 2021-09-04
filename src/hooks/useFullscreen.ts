import { useState, useCallback, useRef } from "react";
import { useDocumentEventListener } from "./useDocumentEventListener";
import { warning } from "./warning";

type EventCallback = (this: Document, event_: any) => any;
type OnChangeEventCallback = (
  this: Document,
  event_: any,
  isOpen: boolean
) => any;

type NoopFunction = () => void;

type FullscreenApi = {
  isEnabled: boolean;
  toggle: NoopFunction | ((element?: Element) => Promise<unknown>);
  request: NoopFunction | ((element?: Element) => Promise<unknown>);
  exit: NoopFunction | (() => Promise<unknown>);
  isFullscreen: boolean;
  element: Element | null;
};

const noop: NoopFunction = () => {};

type FullScreenOptions = {
  onChange?: OnChangeEventCallback;
  onError?: EventCallback;
  requestFullscreenOptions?: FullscreenOptions;
};

// The actual hook
const useFullscreenInternal = (
  options: FullScreenOptions = {}
): FullscreenApi | undefined => {
  // grab the options
  const {
    onChange: onChangeArgument,
    onError: onErrorArgument,
    requestFullscreenOptions = {},
  } = options;

  // state to manage full screen state and the element being fullscreened
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement)
  );
  const [element, setElement] = useState(document.fullscreenElement);

  // request function
  const request = useCallback(
    async (requestedElement?: Element) => {
      try {
        const elementToRequestFullscreenOn =
          requestedElement ?? document.documentElement;

        return await elementToRequestFullscreenOn.requestFullscreen(
          requestFullscreenOptions
        );
      } catch (error) {
        console.log(error);
      }

      return undefined;
    },
    [requestFullscreenOptions]
  );

  // exit fullscreen version
  const exit = useCallback(async () => {
    if (element) {
      try {
        return await document.exitFullscreen();
      } catch (error) {
        console.warn(error);
      }

      return undefined;
    }
  }, [element]);

  // toggle function
  const toggle = useCallback(
    (newElement?: Element) =>
      Boolean(element) ? exit() : newElement ? request(newElement) : null,
    [element, exit, request]
  );

  // fullscreenchange event listener
  // it should handle state accordingly
  useDocumentEventListener("fullscreenchange", (event) => {
    const currentFullscreenElement = document.fullscreenElement;
    const isOpen = Boolean(currentFullscreenElement);
    if (isOpen) {
      // fullscreen was enabled
      setIsFullscreen(true);
      setElement(currentFullscreenElement);
    } else {
      // fullscreen was disabled
      setIsFullscreen(false);
      setElement(null);
    }
    onChangeArgument?.call(document, event, isOpen);
  });

  // fullscreen error handler
  useDocumentEventListener("fullscreenerror", (event) => {
    onErrorArgument?.call(document, event);
  });

  return {
    element,
    exit,
    isEnabled: Boolean(document.fullscreenEnabled),
    isFullscreen,
    request,
    toggle,
  };
};

/**
 * useFullscreen
 * A hook that helps make the document fullscreen
 */
const useFullscreen = (
  options: FullScreenOptions = {}
): FullscreenApi | undefined => {
  if (typeof window === "undefined") {
    return {
      // isFullscreen
      element: null,

      // request
      exit: noop,

      isEnabled: false,

      // exit
      isFullscreen: false,

      // onerror
      request: noop,

      toggle: noop,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFullscreenInternal(options);
};

export { useFullscreen };
