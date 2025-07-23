import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useFreshRef } from "./useFreshRef";

// Gets value from localstorage
function getValueFromLocalStorage(key: string) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const storedValue = localStorage.getItem(key) ?? "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }

  return storedValue;
}

// Saves value to localstorage
function saveValueToLocalStorage<S>(key: string, value: S) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  if (value === undefined) {
    return localStorage.removeItem(key);
  }

  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the localStorage object
 * @param initialState Default initial value
 */
function initialize<S>(key: string, initialState: S | (() => S)) {
  const valueLoadedFromLocalStorage = getValueFromLocalStorage(key);
  if (valueLoadedFromLocalStorage === null) {
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : initialState;
  } else {
    return valueLoadedFromLocalStorage;
  }
}

type UseLocalstorageStateReturnValue<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  () => void
];
type BroadcastCustomEvent<S> = CustomEvent<{ newValue: S }>;
/**
 * useLocalstorageState hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} initialState - Default initial value
 * @see https://rooks.vercel.app/docs/hooks/useLocalstorageState
 */
function useLocalstorageState<S>(
  key: string,
  initialState?: S | (() => S)
): UseLocalstorageStateReturnValue<S> {
  const [value, setValue] = useState(() => initialize(key, initialState));
  const isUpdateFromCrossDocumentListener = useRef(false);
  const isUpdateFromWithinDocumentListener = useRef(false);
  const customEventTypeName = useMemo(() => {
    return `rooks-${key}-localstorage-update`;
  }, [key]);

  useEffect(() => {
    /**
     * We need to ensure there is no loop of
     * storage events fired. Hence we are using a ref
     * to keep track of whether setValue is from another
     * storage event
     */
    if (
      !isUpdateFromCrossDocumentListener.current ||
      !isUpdateFromWithinDocumentListener.current
    ) {
      saveValueToLocalStorage<S>(key, value);
    }
  }, [key, value]);

  const listenToCrossDocumentStorageEvents = useCallback(
    (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === key) {
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

  // check for changes across documents
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
      console.warn("useLocalstorageState: window is undefined.");

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
      console.warn("[useLocalstorageState] document is undefined.");

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
        console.warn("[useLocalstorageState] document is undefined.");
      }
    },
    [customEventTypeName]
  );

  const currentValue = useFreshRef(value, true);

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedNewValue =
        typeof newValue === "function"
          ? (newValue as (prevState: S) => S)(currentValue.current)
          : newValue;
      isUpdateFromCrossDocumentListener.current = false;
      isUpdateFromWithinDocumentListener.current = false;
      setValue(resolvedNewValue);
      broadcastValueWithinDocument(resolvedNewValue);
    },
    [broadcastValueWithinDocument, currentValue]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return [value, set, remove];
}

export { useLocalstorageState };
