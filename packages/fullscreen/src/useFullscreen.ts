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

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [element, setElement] = useState(null);
  const fn = getBrowserFunctions();

  const eventNameMap = {
    change: fn.fullscreenchange,
    error: fn.fullscreenerror
  };

  const request = (element?: HTMLElement) =>
    new Promise((resolve, reject) => {
      const onFullScreenEntered = () => {
        off("change", onFullScreenEntered);
        resolve();
      };

      on("change", onFullScreenEntered);

      element = element || document.documentElement;
      setIsFullscreen(true);
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
    new Promise((resolve, reject) => {
      if (!Boolean(document[fn.fullscreenElement])) {
        resolve();
        return;
      }

      const onFullScreenExit = () => {
        off("change", onFullScreenExit);
        resolve();
      };

      on("change", onFullScreenExit);
      setIsFullscreen(false);
      setElement(null);

      Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
    });

  const toggle = (element?: HTMLElement) =>
    Boolean(document[fn.fullscreenElement]) ? exit() : request(element);

  return {
    element,
    exit,
    isFullscreen,
    off,
    on,
    request,
    toggle,
    isEnabled: Boolean(document[fn.fullscreenEnabled]),
    onchange: (callback: EventCallback) => {
      on("change", callback);
    },
    onerror: (callback: EventCallback) => {
      on("error", callback);
    }
  };
};
