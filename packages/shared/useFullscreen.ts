import { useState } from "react";

type EventCallback = (this: Document, ev: any) => any;
interface NormalizedFullscreenApi {
  requestFullscreen: string;
  exitFullscreen: string;
  fullscreenElement: string;
  fullscreenEnabled: string;
  fullscreenchange: string;
  fullscreenerror: string;
}

const getBrowserFunctions = (): NormalizedFullscreenApi => {
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

type FullscreenApi = {
  isEnabled: boolean,
  toggle: (element?: HTMLElement) => Promise<unknown>, // toggle
  onChange: (callback: EventCallback) => void, // onchange
  onError: (callback: EventCallback) => void, // onerror
  request: (element?: HTMLElement) => Promise<unknown>, // request
  exit: () => Promise<unknown>, // exit
  isFullscreen: boolean, // isFullscreen
  element: HTMLElement
}

/**
 * useFullscreen
 * A hook that helps make the document fullscreen
 */
function useFullscreen(): FullscreenApi | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  const fn = getBrowserFunctions();
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document[fn.fullscreenElement])
  );
  const [element, setElement] = useState(document[fn.fullscreenElement]);

  const eventNameMap = {
    change: fn.fullscreenchange,
    error: fn.fullscreenerror
  };

  const request = (element?: HTMLElement) =>
    new Promise<void>((resolve, reject) => {
      const onFullScreenEntered = () => {
        setIsFullscreen(true);
        off("change", onFullScreenEntered);
        resolve();
      };

      on("change", onFullScreenEntered);

      element = element || document.documentElement;
      setElement(element);

      Promise.resolve(element[fn.requestFullscreen]()).catch(reject);
    });

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
  const exit = () =>
    new Promise<void>((resolve, reject) => {
      if (!Boolean(document[fn.fullscreenElement])) {
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

      Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
    });

  const toggle = (element?: HTMLElement) =>
    Boolean(document[fn.fullscreenElement]) ? exit() : request(element);


  return {
    isEnabled: Boolean(document[fn.fullscreenEnabled]),
    toggle,
    onChange: (callback: EventCallback) => {
      on("change", callback);
    },
    onError: (callback: EventCallback) => {
      on("error", callback);
    },
    request,
    exit,
    isFullscreen,
    element
  }
};

export {useFullscreen}