import { useCallback, useEffect, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";
import { stableSerialize } from "@/utils/stableSerialize";

export type UseMediaDevicesOptions = {
  watch?: boolean;
  requestAccessOnMount?: false | MediaStreamConstraints;
};

export type UseMediaDevicesReturnValue = {
  devices: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  isSupported: boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  requestAccess: (constraints?: MediaStreamConstraints) => Promise<void>;
};

const defaultConstraints: MediaStreamConstraints = {
  audio: true,
  video: true,
};

function categorizeDevices(devices: MediaDeviceInfo[]) {
  return {
    audioInputs: devices.filter(({ kind }) => kind === "audioinput"),
    audioOutputs: devices.filter(({ kind }) => kind === "audiooutput"),
    videoInputs: devices.filter(({ kind }) => kind === "videoinput"),
  };
}

/**
 * useMediaDevices
 * @description Enumerates available media devices and listens for device changes.
 * @see {@link https://rooks.vercel.app/docs/hooks/useMediaDevices}
 */
function useMediaDevices(
  options: UseMediaDevicesOptions = {}
): UseMediaDevicesReturnValue {
  const { watch = true, requestAccessOnMount = false } = options;
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const operationIdRef = useRef(0);
  const mountedRef = useRef(false);
  const initializedSourcesRef = useRef(new Set<string>());
  const requestAccessOnMountRef = useFreshRef(requestAccessOnMount, true);
  const requestAccessKey = requestAccessOnMount
    ? `access:${stableSerialize(requestAccessOnMount)}`
    : "enumerate";

  const isSupported =
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.enumerateDevices === "function";

  const refresh = useCallback(async () => {
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;

    if (!isSupported) {
      if (mountedRef.current) {
        setDevices([]);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextDevices = await navigator.mediaDevices.enumerateDevices();
      if (operationId === operationIdRef.current && mountedRef.current) {
        setDevices(nextDevices);
      }
    } catch (nextError) {
      if (operationId === operationIdRef.current && mountedRef.current) {
        setError(
          nextError instanceof Error ? nextError : new Error(String(nextError))
        );
        setDevices([]);
      }
    } finally {
      if (operationId === operationIdRef.current && mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSupported]);

  const requestAccess = useCallback(
    async (constraints: MediaStreamConstraints = defaultConstraints) => {
      const operationId = operationIdRef.current + 1;
      operationIdRef.current = operationId;

      if (
        typeof navigator === "undefined" ||
        typeof navigator.mediaDevices?.getUserMedia !== "function" ||
        typeof navigator.mediaDevices?.enumerateDevices !== "function"
      ) {
        if (mountedRef.current) {
          setDevices([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        for (const track of stream.getTracks()) {
          track.stop();
        }

        const nextDevices = await navigator.mediaDevices.enumerateDevices();
        if (operationId === operationIdRef.current && mountedRef.current) {
          setDevices(nextDevices);
        }
      } catch (nextError) {
        if (operationId === operationIdRef.current && mountedRef.current) {
          setError(
            nextError instanceof Error
              ? nextError
              : new Error(String(nextError))
          );
        }
      } finally {
        if (operationId === operationIdRef.current && mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isSupported || !watch) {
      return () => {};
    }

    const handleDeviceChange = () => {
      refresh();
    };
    const mediaDevices = navigator.mediaDevices;

    mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [isSupported, refresh, watch]);

  useEffect(() => {
    if (!isSupported || initializedSourcesRef.current.has(requestAccessKey)) {
      return () => {};
    }
    initializedSourcesRef.current.add(requestAccessKey);

    const constraints = requestAccessOnMountRef.current;
    if (constraints) {
      void requestAccess(constraints);
    } else {
      void refresh();
    }

    return () => {};
  }, [
    isSupported,
    refresh,
    requestAccess,
    requestAccessKey,
    requestAccessOnMountRef,
  ]);

  const { audioInputs, audioOutputs, videoInputs } = categorizeDevices(devices);

  return {
    devices,
    audioInputs,
    audioOutputs,
    videoInputs,
    isSupported,
    isLoading,
    error,
    refresh,
    requestAccess,
  };
}

export { useMediaDevices };
