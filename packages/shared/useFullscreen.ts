import { useState, useCallback } from "react";

type EventCallback = (this: Document, ev: any) => any;
interface NormalizedFullscreenApi {
  requestFullscreen: string;
  exitFullscreen: string;
  fullscreenElement: string;
  fullscreenEnabled: string;
  fullscreenchange: string;
  fullscreenerror: string;
}

const getFullscreenControls = (): NormalizedFullscreenApi => {
  const fnMap = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror"
    ],
    // New WebKit
    [
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
    // Old WebKit
    [
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror"
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError"
    ]
  ];

  const ret = {} as NormalizedFullscreenApi;

  fnMap.forEach(fnSet => {
    if (fnSet && fnSet[1] in document) {
      fnSet.forEach((_fn, i) => {
        ret[fnMap[0][i]] = fnSet[i];
      });
    }
  });
  return ret;
};
type NoopFunction = () => void

type FullscreenApi = {
  isEnabled: boolean,
  toggle: NoopFunction | ((element?: HTMLElement) => Promise<unknown>), // toggle
  onChange: NoopFunction | ((callback: EventCallback) => void), // onchange
  onError: NoopFunction | ((callback: EventCallback) => void), // onerror
  request: NoopFunction | ((element?: HTMLElement) => Promise<unknown>), // request
  exit: NoopFunction | (() => Promise<unknown>), // exit
  isFullscreen: boolean, // isFullscreen
  element: HTMLElement | null
}

const noop: NoopFunction = () => {}

const defaultValue: FullscreenApi = {
  isEnabled: false,
  toggle: noop, // toggle
  onChange: noop, // onchange
  onError: noop, // onerror
  request: noop, // request
  exit: noop, // exit
  isFullscreen: false, // isFullscreen
  element: null
}


/**
 * useFullscreen
 * A hook that helps make the document fullscreen
 */
function useFullscreen(): FullscreenApi | undefined {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const fullscreenControls = getFullscreenControls();
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document[fullscreenControls.fullscreenElement])
  );
  const [element, setElement] = useState(document[fullscreenControls.fullscreenElement]);

  const eventNameMap = {
    change: fullscreenControls.fullscreenchange,
    error: fullscreenControls.fullscreenerror
  };

  const request = useCallback((element?: HTMLElement) =>
    new Promise<void>((resolve, reject) => {
      const onFullScreenEntered = () => {
        setIsFullscreen(true);
        off("change", onFullScreenEntered);
        resolve();
      };

      on("change", onFullScreenEntered);

      element = element || document.documentElement;
      setElement(element);

      Promise.resolve(element[fullscreenControls.requestFullscreen]()).catch(reject);
    }), []);

  const on = (event: string, callback: EventCallback) => {
    const eventName = eventNameMap[event];
    if (eventName) {
      document.addEventListener(eventName, callback, false);
    }
  };
  const off = (event: string, callback: EventCallback) => {
    const eventName = eventNameMap[event];
    if (eventName) {
      document.removeEventListener(eventName, callback, false);
    }
  };
  const exit = useCallback(() =>
    new Promise<void>((resolve, reject) => {
      if (!Boolean(document[fullscreenControls.fullscreenElement])) {
        resolve();
        return;
      }

      const onFullScreenExit = () => {
        setIsFullscreen(false);
        off("change", onFullScreenExit);
        resolve();
      };

      on("change", onFullScreenExit);
      setElement(null);

      Promise.resolve(document[fullscreenControls.exitFullscreen]()).catch(reject);
    }), []);

  const toggle = useCallback((element?: HTMLElement) =>
    Boolean(document[fullscreenControls.fullscreenElement]) ? exit() : request(element), []);

  const onChange = useCallback((callback: EventCallback) => on("change", callback), []);
  const onError =  useCallback((callback: EventCallback) => on("error", callback), []);

  return {
    isEnabled: Boolean(document[fullscreenControls.fullscreenEnabled]),
    toggle,
    onChange,
    onError,
    request,
    exit,
    isFullscreen,
    element
  }
};

export {useFullscreen}
