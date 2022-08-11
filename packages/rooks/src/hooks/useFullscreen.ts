import { useState, useCallback, useEffect } from "react";
import type { RefObject } from "react";

declare global {
  interface Element {
    webkitRequestFullscreen: Element["requestFullscreen"];
    webkitRequestFullScreen: Element["requestFullscreen"];
    mozRequestFullScreen: Element["requestFullscreen"];
    msRequestFullscreen: Element["requestFullscreen"];
  }

  interface Document {
    webkitFullscreenEnabled: Document["fullscreenEnabled"];
    mozFullScreenEnabled: Document["fullscreenEnabled"];
    msFullscreenEnabled: Document["fullscreenEnabled"];

    webkitFullscreenElement: Document["fullscreenElement"];
    webkitCurrentFullScreenElement: Document["fullscreenElement"];
    mozFullScreenElement: Document["fullscreenElement"];
    msFullscreenElement: Document["fullscreenElement"];

    webkitExitFullscreen: Document["exitFullscreen"];
    webkitCancelFullScreen: Document["exitFullscreen"];
    mozCancelFullScreen: Document["exitFullscreen"];
    msExitFullscreen: Document["exitFullscreen"];
  }

  interface DocumentEventMap {
    webkitfullscreenchange: DocumentEventMap["fullscreenchange"];
    mozfullscreenchange: DocumentEventMap["fullscreenchange"];
    MSFullscreenChange: DocumentEventMap["fullscreenchange"];

    webkitfullscreenerror: DocumentEventMap["fullscreenerror"];
    mozfullscreenerror: DocumentEventMap["fullscreenerror"];
    MSFullscreenError: DocumentEventMap["fullscreenerror"];
  }
}

const FullscreenApi = {
  DOM_UNAVAILABLE_ERROR:
    "DOM is unavailable server-side. Please use this method client-side only.",
  FULLSCREEN_UNSUPPORTED_ERROR: "Your browser does not support Fullscreen API.",

  getEventsNames() {
    if (typeof document === "undefined") return null;

    if ("exitFullscreen" in document)
      return ["fullscreenchange", "fullscreenerror"];
    if ("webkitExitFullscreen" in document)
      return ["webkitfullscreenchange", "webkitfullscreenerror"];
    if ("webkitCancelFullScreen" in document)
      return ["webkitfullscreenchange", "webkitfullscreenerror"];
    if ("mozCancelFullScreen" in document)
      return ["mozfullscreenchange", "mozfullscreenerror"];
    if ("msExitFullscreen" in document)
      return ["MSFullscreenChange", "MSFullscreenError"];

    return null;
  },

  getEventName(eventType: "change" | "error") {
    const eventsNames = this.getEventsNames();
    if (!eventsNames) return null;

    if (eventType === "change") return eventsNames[0];
    if (eventType === "error") return eventsNames[1];
  },

  get fullscreenEnabled() {
    if (typeof document === "undefined") return false;

    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      !!document.webkitCancelFullScreen ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      false
    );
  },

  get fullscreenElement() {
    if (typeof document === "undefined") return null;

    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.webkitCurrentFullScreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  },

  requestFullscreen(
    element: Element | null,
    options?: FullscreenOptions | undefined
  ): Promise<void> {
    if (typeof document === "undefined")
      throw new Error(this.DOM_UNAVAILABLE_ERROR);

    const target = element ?? document.documentElement;

    const method =
      target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.webkitRequestFullScreen ||
      target.mozRequestFullScreen ||
      target.msRequestFullscreen;

    if (!method) throw new Error(this.FULLSCREEN_UNSUPPORTED_ERROR);

    return method.call(target, options);
  },

  exitFullscreen(): Promise<void> {
    if (typeof document === "undefined")
      throw new Error(this.DOM_UNAVAILABLE_ERROR);

    const method =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (!method) throw new Error(this.FULLSCREEN_UNSUPPORTED_ERROR);

    return method.call(document);
  },

  on(eventType: "change" | "error", callback: (event: Event) => void) {
    const eventName = this.getEventName(eventType);
    if (!eventName) return;

    document?.addEventListener(eventName, callback);
  },

  off(eventType: "change" | "error", callback: (event: Event) => void) {
    const eventName = this.getEventName(eventType);
    if (!eventName) return;

    document?.removeEventListener(eventName, callback);
  },
};

interface UseFullscreenProps {
  target?: RefObject<Element>;
  onChange?: (event: Event) => void;
  onError?: (event: Event) => void;
  requestFullScreenOptions?: FullscreenOptions;
}

function useFullscreen(props: UseFullscreenProps = {}) {
  const { target, onChange, onError, requestFullScreenOptions } = props;

  const [isFullscreenAvailable, setIsFullscreenAvailable] =
    useState<boolean>(false);
  const [fullscreenElement, setFullscreenElement] = useState<Element | null>(
    null
  );
  const [isFullscreenEnabled, setIsFullscreenEnabled] =
    useState<boolean>(false);

  const enableFullscreen = useCallback(() => {
    return FullscreenApi.requestFullscreen(
      target?.current || null,
      requestFullScreenOptions
    );
  }, [target, requestFullScreenOptions]);

  const disableFullscreen = useCallback(() => {
    return FullscreenApi.exitFullscreen();
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!!FullscreenApi.fullscreenElement) return disableFullscreen();
    return enableFullscreen();
  }, [enableFullscreen, disableFullscreen]);

  const onChangeHandler = useCallback(
    (event: Event) => {
      const fullscreenElement = FullscreenApi.fullscreenElement;
      setFullscreenElement(fullscreenElement);
      setIsFullscreenEnabled(!!fullscreenElement);
      onChange?.(event);
    },
    [onChange]
  );

  const onErrorHandler = useCallback(
    (event: Event) => {
      const fullscreenElement = FullscreenApi.fullscreenElement;
      setFullscreenElement(fullscreenElement);
      setIsFullscreenEnabled(!!fullscreenElement);
      onError?.(event);
    },
    [onError]
  );

  // Set state after first client-side render
  useEffect(() => {
    setIsFullscreenAvailable(FullscreenApi.fullscreenEnabled);
  }, []);

  // Attach event listeners
  useEffect(() => {
    FullscreenApi.on("change", onChangeHandler);
    FullscreenApi.on("error", onErrorHandler);

    return () => {
      FullscreenApi.off("change", onChangeHandler);
      FullscreenApi.off("error", onErrorHandler);
    };
  }, [onChangeHandler, onErrorHandler]);

  return {
    isFullscreenAvailable,
    fullscreenElement,
    isFullscreenEnabled,
    enableFullscreen,
    disableFullscreen,
    toggleFullscreen,
  };
}

export { useFullscreen };
