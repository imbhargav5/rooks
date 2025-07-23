import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

function getValueFromSessionStorage(key: string) {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  const storedValue = sessionStorage.getItem(key) ?? "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }

  return storedValue;
}

function saveValueToSessionStorage<S>(key: string, value: S) {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  return sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the sessionStorage object
 * @param initialState Default initial value
 */
function initialize<S>(key: string, initialState: S) {
  const valueLoadedFromSessionStorage = getValueFromSessionStorage(key);
  if (valueLoadedFromSessionStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromSessionStorage;
  }
}

type UseSessionstorateStateReturnValue<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  () => void
];
type BroadcastCustomEvent<S> = CustomEvent<{ newValue: S }>;

/**
 * useSessionstorageState hook
 * Tracks a value within sessionStorage and updates it
 *
 * @param {string} key - Key of the sessionStorage object
 * @param {any} initialState - Default initial value
 * @returns {[any, Dispatch<SetStateAction<any>>, () => void]}
 * @see https://rooks.vercel.app/docs/hooks/useSessionstorageState
 */
function useSessionstorageState<S>(
  key: string,
  initialState?: S | (() => S)
): UseSessionstorateStateReturnValue<S> {
  const [value, setValue] = useState(() => initialize(key, initialState));
  const isUpdateFromCrossDocumentListener = useRef(false);
  const isUpdateFromWithinDocumentListener = useRef(false);
  const customEventTypeName = useMemo(() => {
    return `rooks-${key}-sessionstorage-update`;
  }, [key]);
  useEffect(() => {
    /**
     * We need to ensure there is no loop of
     * storage events fired. Hence we are using a ref
     * to keep track of whether setValue is from another
     * storage event
     */
    if (!isUpdateFromCrossDocumentListener.current) {
      saveValueToSessionStorage(key, value);
    }
  }, [key, value]);

  const listenToCrossDocumentStorageEvents = useCallback(
    (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        try {
          isUpdateFromCrossDocumentListener.current = true;
          const newValue = JSON.parse(event.newValue ?? "null");
          if (value !== newValue) {
            setValue(newValue);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [key, value]
  );

  // check for changes across windows
  useEffect(() => {

    if (typeof window !== "undefined") {
      window.addEventListener("storage", listenToCrossDocumentStorageEvents);

      return () => {
        window.removeEventListener(
          "storage",
          listenToCrossDocumentStorageEvents
        );
      };
    } else {
      console.warn("[useSessionstorageState] window is undefined.");

      return () => { };
    }
  }, [listenToCrossDocumentStorageEvents]);

  const listenToCustomEventWithinDocument = useCallback(
    (event: BroadcastCustomEvent<S>) => {
      try {
        isUpdateFromWithinDocumentListener.current = true;
        const { newValue } = event.detail;
        if (value !== newValue) {
          setValue(newValue);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [value]
  );

  // check for changes within document
  useEffect(() => {

    if (typeof document !== "undefined") {
      document.addEventListener(
        customEventTypeName,
        listenToCustomEventWithinDocument as EventListener
      );

      return () => {
        document.removeEventListener(
          customEventTypeName,
          listenToCustomEventWithinDocument as EventListener
        );
      };
    } else {
      console.warn("[useSessionstorageState] document is undefined.");

      return () => { };
    }
  }, [customEventTypeName, listenToCustomEventWithinDocument]);

  const broadcastValueWithinDocument = useCallback(
    (newValue: S) => {

      if (typeof document !== "undefined") {
        const event: BroadcastCustomEvent<S> = new CustomEvent(
          customEventTypeName,
          { detail: { newValue } }
        );
        document.dispatchEvent(event);
      } else {
        console.warn("[useSessionstorageState] document is undefined.");
      }
    },
    [customEventTypeName]
  );

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedNewValue = typeof newValue === "function"
        ? (newValue as (prevState: S) => S)(value)
        : newValue;
      isUpdateFromCrossDocumentListener.current = false;
      isUpdateFromWithinDocumentListener.current = false;
      setValue(resolvedNewValue);
      broadcastValueWithinDocument(resolvedNewValue);
    },
    [broadcastValueWithinDocument, value]
  );

  const remove = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  return [value, set, remove];
}

export { useSessionstorageState };
