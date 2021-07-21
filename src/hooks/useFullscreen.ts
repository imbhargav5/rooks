import { useState, useCallback, useRef } from "react";
import { useDocumentEventListener } from "./useDocumentEventListener";
import { warning } from "./warning";

type EventCallback = (this: Document, event_: any) => any;
type OnChangeEventCallback = (
  this: Document,
  event_: any,
  isOpen: boolean
) => any;

type NormalizedFullscreenApi = {
  requestFullscreen: string;
  exitFullscreen: string;
  fullscreenElement: string;
  fullscreenEnabled: string;
  fullscreenchange: string;
  fullscreenerror: string;
};

const getFullscreenControls = (): NormalizedFullscreenApi => {
  const functionMap = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror",
    ],
    // New WebKit
    [
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    // Old WebKit
    [
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror",
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError",
    ],
  ];

  const returnValue = {} as NormalizedFullscreenApi;

  functionMap.forEach((functionSet) => {
    if (functionSet && functionSet[1] in document) {
      functionSet.forEach((_function, index) => {
        returnValue[functionMap[0][index]] = functionSet[index];
      });
    }
  });

  return returnValue;
};
type NoopFunction = () => void;

type FullscreenApi = {
  isEnabled: boolean;
  toggle: NoopFunction | ((element?: HTMLElement) => Promise<unknown>); // toggle

  /** @deprecated Please use useFullScreen({onChange : function() {}}) instead. */
  onChange: NoopFunction | ((callback: OnChangeEventCallback) => void); // onchange

  /** @deprecated Please use useFullScreen({onError : function() {}}) instead. */
  onError: NoopFunction | ((callback: EventCallback) => void); // onerror
  request: NoopFunction | ((element?: HTMLElement) => Promise<unknown>); // request
  exit: NoopFunction | (() => Promise<unknown>); // exit
  isFullscreen: boolean; // isFullscreen
  element: HTMLElement | null | undefined;
};

const noop: NoopFunction = () => {};

const defaultValue: FullscreenApi = {
  // isFullscreen
  element: undefined,

  // request
  exit: noop,

  isEnabled: false,

  // exit
  isFullscreen: false,

  // toggle
  onChange: noop,

  // onchange
  onError: noop,

  // onerror
  request: noop,

  toggle: noop,
};

type RequestFullscreenOptions = {
  // string will help to ease type casting
  navigationUI?: string | "auto" | "hide" | "show";
};

type FullScreenOptions = {
  onChange?: OnChangeEventCallback;
  onError?: EventCallback;
  requestFullscreenOptions?: RequestFullscreenOptions;
};

function warnDeprecatedOnChangeAndOnErrorUsage() {
  warning(
    false,
    `Using onChange and onError from the return value is deprecated and 
    will be removed in the next major version. 
    Please use it with arguments instead. 
    For eg: useFullscreen({onChange: function() {}, onError: function(){}})
  `
  );
}

/**
 * useFullscreen
 * A hook that helps make the document fullscreen
 */
function useFullscreen(
  options: FullScreenOptions = {}
): FullscreenApi | undefined {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const {
    onChange: onChangeArgument,
    onError: onErrorArgument,
    requestFullscreenOptions = {},
  } = options;

  const fullscreenControls = getFullscreenControls();
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document[fullscreenControls.fullscreenElement])
  );
  const [element, setElement] = useState(
    document[fullscreenControls.fullscreenElement]
  );

  const request = useCallback(async (element?: HTMLElement) => {
    try {
      const finalElement = element || document.documentElement;

      return await finalElement[fullscreenControls.requestFullscreen](
        requestFullscreenOptions
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const exit = useCallback(async () => {
    if (element) {
      try {
        return await document[fullscreenControls.exitFullscreen]();
      } catch (error) {
        console.warn(error);
      }
    }
  }, [element]);

  const toggle = useCallback(
    (newElement?: HTMLElement) =>
      Boolean(element) ? exit() : newElement ? request(newElement) : null,
    [element]
  );

  const onChangeDeprecatedHandlerRef = useRef<Function>(noop);
  const onErrorDeprecatedHandlerRef = useRef<Function>(noop);

  // Hack to not break it for everyone
  // Honestly these two functions are tragedy and must be removed in v5
  const onChangeDeprecated = useCallback((callback: OnChangeEventCallback) => {
    warnDeprecatedOnChangeAndOnErrorUsage();

    return (onChangeDeprecatedHandlerRef.current = callback);
  }, []);

  const onErrorDeprecated = useCallback((callback: EventCallback) => {
    warnDeprecatedOnChangeAndOnErrorUsage();

    return (onErrorDeprecatedHandlerRef.current = callback);
  }, []);

  useDocumentEventListener(fullscreenControls.fullscreenchange, (event) => {
    const currentFullscreenElement =
      document[fullscreenControls.fullscreenElement];
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
    onChangeDeprecatedHandlerRef.current?.call(document, event, isOpen);
  });

  useDocumentEventListener(fullscreenControls.fullscreenerror, (event) => {
    onErrorArgument?.call(document, event);
    onErrorDeprecatedHandlerRef.current?.call(document, event);
  });

  return {
    element,
    exit,
    isEnabled: Boolean(document[fullscreenControls.fullscreenEnabled]),
    isFullscreen,
    onChange: onChangeDeprecated,
    onError: onErrorDeprecated,
    request,
    toggle,
  };
}

export { useFullscreen };
