import type { Dispatch, SetStateAction } from "react";
import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useInsertionEffect,
  useRef,
} from "react";

function getValueFromSessionStorage(key: string) {
  try {
    if (typeof sessionStorage === "undefined") {
      return null;
    }

    const storedValue = sessionStorage.getItem(key) ?? "null";

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(error);
      return storedValue;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

function saveValueToSessionStorage<S>(key: string, value: S) {
  try {
    if (typeof sessionStorage === "undefined") {
      return null;
    }

    if (value === undefined) {
      return sessionStorage.removeItem(key);
    }

    return sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * @param key Key of the sessionStorage object
 * @param initialState Default initial value
 */
function initialize<S>(key: string, initialState: S | (() => S)) {
  const valueLoadedFromSessionStorage = getValueFromSessionStorage(key);
  if (valueLoadedFromSessionStorage === null) {
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : initialState;
  } else {
    return valueLoadedFromSessionStorage;
  }
}

type UseSessionstorageStateReturnValue<S> = [
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
 * @param initialState - Default initial value
 * @returns Tuple containing the stored value, setter, and remove callback
 * @see https://rooks.vercel.app/docs/hooks/useSessionstorageState
 */
function useSessionstorageState<S>(
  key: string,
  initialState?: S | (() => S)
): UseSessionstorageStateReturnValue<S> {
  const [value, setValue] = useState(() => initialize(key, initialState));
  const [stateKey, setStateKey] = useState(key);
  const currentValueRef = useRef(value);
  const currentKeyRef = useRef(key);

  useInsertionEffect(() => {
    currentValueRef.current = value;
    currentKeyRef.current = key;
  }, [key, value]);

  if (stateKey !== key) {
    setStateKey(key);
    setValue(initialize(key, initialState));
  }
  const isUpdateFromCrossDocumentListener = useRef(false);
  const isUpdateFromWithinDocumentListener = useRef(false);
  const updateSourceKeyRef = useRef<string | null>(null);
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
    const cameFromSynchronizedUpdate =
      (isUpdateFromCrossDocumentListener.current ||
        isUpdateFromWithinDocumentListener.current) &&
      updateSourceKeyRef.current === key;

    if (!cameFromSynchronizedUpdate) {
      saveValueToSessionStorage(key, value);
    }

    isUpdateFromCrossDocumentListener.current = false;
    isUpdateFromWithinDocumentListener.current = false;
    updateSourceKeyRef.current = null;
  }, [key, value]);

  const listenToCrossDocumentStorageEvents = useCallback(
    (event: StorageEvent) => {
      try {
        if (event.storageArea === sessionStorage && event.key === key) {
          const newValue = JSON.parse(event.newValue ?? "null");
          isUpdateFromCrossDocumentListener.current = true;
          updateSourceKeyRef.current = key;
          currentValueRef.current = newValue;
          setValue((currentValue: S) =>
            Object.is(currentValue, newValue) ? currentValue : newValue
          );
        }
      } catch (error) {
        isUpdateFromCrossDocumentListener.current = false;
        updateSourceKeyRef.current = null;
        console.log(error);
      }
    },
    [currentValueRef, key]
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
        const { newValue } = event.detail;
        isUpdateFromWithinDocumentListener.current = true;
        updateSourceKeyRef.current = key;
        currentValueRef.current = newValue;
        setValue((currentValue: S) =>
          Object.is(currentValue, newValue) ? currentValue : newValue
        );
      } catch (error) {
        isUpdateFromWithinDocumentListener.current = false;
        updateSourceKeyRef.current = null;
        console.log(error);
      }
    },
    [currentValueRef, key]
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
    (storageKey: string, newValue: S) => {

      if (typeof document !== "undefined") {
        const event: BroadcastCustomEvent<S> = new CustomEvent(
          `rooks-${storageKey}-sessionstorage-update`,
          { detail: { newValue } }
        );
        document.dispatchEvent(event);
      } else {
        console.warn("[useSessionstorageState] document is undefined.");
      }
    },
    []
  );

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedNewValue = typeof newValue === "function"
        ? (newValue as (prevState: S) => S)(currentValueRef.current)
        : newValue;
      const storageKey = currentKeyRef.current;
      isUpdateFromCrossDocumentListener.current = false;
      isUpdateFromWithinDocumentListener.current = true;
      updateSourceKeyRef.current = storageKey;
      currentValueRef.current = resolvedNewValue;
      saveValueToSessionStorage<S>(storageKey, resolvedNewValue);
      setValue(resolvedNewValue);
      broadcastValueWithinDocument(storageKey, resolvedNewValue);
    },
    [broadcastValueWithinDocument, currentKeyRef, currentValueRef]
  );

  const remove = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [value, set, remove];
}

export { useSessionstorageState };
