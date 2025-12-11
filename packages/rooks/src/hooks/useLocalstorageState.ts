import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

// Gets value from localstorage
function getValueFromLocalStorage<S>(key: string): S | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const storedValue = localStorage.getItem(key) ?? "null";
  try {
    return JSON.parse(storedValue) as S;
  } catch (error) {
    console.error(error);
  }

  return storedValue as S;
}

// Saves value to localstorage
function saveValueToLocalStorage<S>(key: string, value: S): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

type UseLocalstorageStateReturnValue<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  () => void
];

// Per-key store management for localStorage
type StoreData<S> = {
  value: S;
  listeners: Set<() => void>;
  initialized: boolean;
};

const stores = new Map<string, StoreData<unknown>>();

function getOrCreateStore<S>(key: string, initialState: S | (() => S) | undefined): StoreData<S> {
  if (!stores.has(key)) {
    // Initialize with value from localStorage or initialState
    const valueFromStorage = getValueFromLocalStorage<S>(key);
    const value = valueFromStorage !== null
      ? valueFromStorage
      : typeof initialState === "function"
        ? (initialState as () => S)()
        : (initialState as S);

    stores.set(key, {
      value,
      listeners: new Set(),
      initialized: true,
    });
  }
  return stores.get(key) as StoreData<S>;
}

function notifyListeners(key: string): void {
  const store = stores.get(key);
  if (store) {
    store.listeners.forEach((listener) => listener());
  }
}

// Handle storage events from other documents/tabs
function handleStorageEvent(event: StorageEvent): void {
  if (event.storageArea === localStorage && event.key !== null) {
    const store = stores.get(event.key);
    if (store) {
      try {
        const newValue = JSON.parse(event.newValue ?? "null");
        store.value = newValue;
        notifyListeners(event.key);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

// Track global storage event listener
let isStorageListenerAttached = false;

function attachStorageListener(): void {
  if (!isStorageListenerAttached && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
    isStorageListenerAttached = true;
  }
}

function detachStorageListenerIfNeeded(): void {
  // Check if any stores have listeners
  let hasListeners = false;
  stores.forEach((store) => {
    if (store.listeners.size > 0) {
      hasListeners = true;
    }
  });

  if (!hasListeners && isStorageListenerAttached && typeof window !== "undefined") {
    window.removeEventListener("storage", handleStorageEvent);
    isStorageListenerAttached = false;
  }
}

// Clean up store when no longer needed
function cleanupStore(key: string): void {
  const store = stores.get(key);
  if (store && store.listeners.size === 0) {
    stores.delete(key);
  }
}

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
  // Track if we need to write initial value to localStorage
  const needsInitialWrite = useRef(true);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const store = getOrCreateStore<S>(key, initialState);
      store.listeners.add(onStoreChange);
      attachStorageListener();

      return () => {
        store.listeners.delete(onStoreChange);
        detachStorageListenerIfNeeded();
        cleanupStore(key);
      };
    },
    [key, initialState]
  );

  const getSnapshot = useCallback(() => {
    const store = getOrCreateStore<S>(key, initialState);
    return store.value;
  }, [key, initialState]);

  const getServerSnapshot = useCallback(() => {
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : (initialState as S);
  }, [initialState]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Write initial value to localStorage (matching old behavior)
  useEffect(() => {
    if (needsInitialWrite.current) {
      needsInitialWrite.current = false;
      const store = getOrCreateStore<S>(key, initialState);
      if (store.value !== undefined) {
        saveValueToLocalStorage(key, store.value);
      }
    }
  }, [key, initialState]);

  const customEventTypeName = useMemo(() => {
    return `rooks-${key}-localstorage-update`;
  }, [key]);

  const broadcastValueWithinDocument = useCallback(
    (newValue: S) => {
      if (typeof document !== "undefined") {
        const event = new CustomEvent(customEventTypeName, {
          detail: { newValue },
        });
        document.dispatchEvent(event);
      }
    },
    [customEventTypeName]
  );

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const store = getOrCreateStore<S>(key, initialState);
      const resolvedNewValue =
        typeof newValue === "function"
          ? (newValue as (prevState: S) => S)(store.value)
          : newValue;

      // Update store and localStorage
      store.value = resolvedNewValue;
      saveValueToLocalStorage(key, resolvedNewValue);

      // Notify all listeners (within this document)
      notifyListeners(key);

      // Broadcast to other hook instances in the same document
      broadcastValueWithinDocument(resolvedNewValue);
    },
    [key, initialState, broadcastValueWithinDocument]
  );

  const remove = useCallback(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
      const store = getOrCreateStore<S>(key, initialState);
      const resetValue =
        typeof initialState === "function"
          ? (initialState as () => S)()
          : (initialState as S);
      store.value = resetValue;
      notifyListeners(key);
    }
  }, [key, initialState]);

  // Listen for custom events from other hook instances in the same document
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ newValue: S }>;
      const store = getOrCreateStore<S>(key, initialState);
      if (store.value !== customEvent.detail.newValue) {
        store.value = customEvent.detail.newValue;
        notifyListeners(key);
      }
    };

    document.addEventListener(customEventTypeName, handler);
    return () => {
      document.removeEventListener(customEventTypeName, handler);
    };
  }, [key, initialState, customEventTypeName]);

  return [value, set, remove];
}

export { useLocalstorageState };
