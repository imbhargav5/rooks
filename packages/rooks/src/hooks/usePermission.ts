import { useCallback, useEffect, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { stableSerialize } from "@/utils/stableSerialize";

export type PermissionNameLike = PermissionName | (string & {});

export type PermissionDescriptorLike =
  | (Omit<PermissionDescriptor, "name"> & {
      name: PermissionNameLike;
      [key: string]: unknown;
    })
  | null;

export type UsePermissionOptions = {
  watch?: boolean;
  enabled?: boolean;
};

export type UsePermissionReturnValue = {
  state: PermissionState | "unsupported";
  isSupported: boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

/**
 * usePermission
 * @description Queries and optionally watches browser permission state.
 * @see {@link https://rooks.vercel.app/docs/hooks/usePermission}
 */
function usePermission(
  descriptor: PermissionDescriptorLike,
  options: UsePermissionOptions = {}
): UsePermissionReturnValue {
  const { watch = true, enabled = true } = options;
  const [state, setState] = useState<PermissionState | "unsupported">(
    "unsupported"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryIdRef = useRef(0);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);
  const listenerCleanupRef = useRef<(() => void) | null>(null);
  const descriptorRef = useFreshRef(descriptor, true);
  const watchRef = useFreshRef(watch, true);
  const descriptorKey = stableSerialize(descriptor);

  const isSupported =
    typeof navigator !== "undefined" &&
    typeof navigator.permissions?.query === "function";

  const detachPermissionStatus = useCallback(() => {
    listenerCleanupRef.current?.();
    listenerCleanupRef.current = null;
  }, []);

  const bindPermissionStatus = useCallback(
    (
      permissionStatus: PermissionStatus,
      queryId: number,
      shouldWatch: boolean
    ) => {
      detachPermissionStatus();
      permissionStatusRef.current = permissionStatus;
      if (!shouldWatch) {
        return;
      }

      const handleChange = () => {
        if (
          queryId === queryIdRef.current &&
          permissionStatusRef.current === permissionStatus
        ) {
          setState(permissionStatus.state);
        }
      };

      if (typeof permissionStatus.addEventListener === "function") {
        permissionStatus.addEventListener("change", handleChange);
        listenerCleanupRef.current = () => {
          permissionStatus.removeEventListener("change", handleChange);
        };
        return;
      }

      const previousHandler = permissionStatus.onchange;
      permissionStatus.onchange = handleChange;
      listenerCleanupRef.current = () => {
        if (permissionStatus.onchange === handleChange) {
          permissionStatus.onchange = previousHandler;
        }
      };
    },
    [detachPermissionStatus]
  );

  const refresh = useCallback(async () => {
    const currentDescriptor = descriptorRef.current;
    const queryId = queryIdRef.current + 1;
    queryIdRef.current = queryId;
    detachPermissionStatus();
    permissionStatusRef.current = null;

    if (!enabled || !currentDescriptor || !isSupported) {
      setState("unsupported");
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextPermissionStatus = await navigator.permissions.query(
        currentDescriptor as PermissionDescriptor
      );
      if (queryId !== queryIdRef.current) {
        return;
      }

      bindPermissionStatus(
        nextPermissionStatus,
        queryId,
        watchRef.current && enabled
      );
      setState(nextPermissionStatus.state);
    } catch (queryError) {
      if (queryId !== queryIdRef.current) {
        return;
      }

      setError(
        queryError instanceof Error ? queryError : new Error(String(queryError))
      );
      permissionStatusRef.current = null;
      setState("unsupported");
    } finally {
      if (queryId === queryIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    bindPermissionStatus,
    descriptorRef,
    detachPermissionStatus,
    enabled,
    isSupported,
    watchRef,
  ]);

  useIsomorphicEffect(() => {
    void refresh();
  }, [descriptorKey, enabled, isSupported, refresh]);

  useEffect(() => {
    const permissionStatus = permissionStatusRef.current;
    if (permissionStatus) {
      bindPermissionStatus(
        permissionStatus,
        queryIdRef.current,
        watch && enabled
      );
    }
  }, [bindPermissionStatus, enabled, watch]);

  useEffect(() => {
    return () => {
      queryIdRef.current += 1;
      detachPermissionStatus();
      permissionStatusRef.current = null;
    };
  }, [detachPermissionStatus]);

  return {
    state,
    isSupported,
    isLoading,
    error,
    refresh,
  };
}

export { usePermission };
