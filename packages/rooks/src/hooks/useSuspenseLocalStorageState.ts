/**
 * useSuspenseLocalStorageState
 * @description Suspense-enabled hook for localStorage state management with cross-tab synchronization
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseLocalStorageState}
 */

/// <reference lib="dom" />

import { useState, useEffect, useCallback, useMemo } from "react";

// Cache entry interface for managing localStorage promises and results
interface CacheEntry<T> {
    promise: Promise<T>;
    status: 'pending' | 'resolved' | 'rejected';
    result?: T;
    error?: Error;
}

// Cache for storing promises and results indexed by key
const cache: Map<string, CacheEntry<any>> = new Map();

/**
 * Clear cached entry for a specific key - useful for testing
 * @internal
 * @param key - The localStorage key to clear from cache
 */
export function clearCache(key?: string) {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}

/**
 * Gets value from localStorage with error handling
 * @param key - The localStorage key
 * @returns The parsed value or null if not found/error
 */
function getValueFromLocalStorage(key: string): string | null {
    if (typeof localStorage === "undefined") {
        return null;
    }

    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Failed to get value from localStorage for key "${key}":`, error);
        return null;
    }
}

/**
 * Saves value to localStorage with error handling
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON stringified)
 */
function saveValueToLocalStorage<T>(key: string, value: T): void {
    if (typeof localStorage === "undefined") {
        return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save value to localStorage for key "${key}":`, error);
    }
}

/**
 * Removes value from localStorage with error handling
 * @param key - The localStorage key to remove
 */
function removeValueFromLocalStorage(key: string): void {
    if (typeof localStorage === "undefined") {
        return;
    }

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to remove value from localStorage for key "${key}":`, error);
    }
}

/**
 * Creates a promise that resolves with the initialized value
 * @param key - The localStorage key
 * @param initializer - Function to transform raw localStorage value into typed value
 * @returns Promise that resolves to the initialized value
 */
function createInitializationPromise<T>(
    key: string,
    initializer: (currentValue: string | null) => T
): Promise<T> {
    return new Promise((resolve, reject) => {
        try {
            // Simulate async behavior to work with Suspense
            setTimeout(() => {
                try {
                    const rawValue = getValueFromLocalStorage(key);
                    const initializedValue = initializer(rawValue);
                    resolve(initializedValue);
                } catch (error) {
                    reject(error instanceof Error ? error : new Error(String(error)));
                }
            }, 0);
        } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
        }
    });
}

/**
 * Control methods interface for the hook
 */
interface UseSuspenseLocalStorageStateControls<T> {
    /**
     * Get the current value from the hook's state
     * @returns The current state value
     */
    getItem: () => T;
    
    /**
     * Set a new value in localStorage and update state
     * @param value - The new value to set
     */
    setItem: (value: T) => void;
    
    /**
     * Delete the item from localStorage and reset to initial value
     */
    deleteItem: () => void;
}

/**
 * Return type for the useSuspenseLocalStorageState hook
 */
type UseSuspenseLocalStorageStateReturnValue<T> = [
    T,
    UseSuspenseLocalStorageStateControls<T>
];

/**
 * Custom event type for cross-tab communication
 */
type BroadcastCustomEvent<T> = CustomEvent<{ newValue: T }>;

/**
 * Suspense-enabled hook for localStorage state management with cross-tab synchronization
 * 
 * This hook will suspend (throw a promise) during initialization to work with React Suspense.
 * It provides localStorage state management with proper TypeScript generics, JSON serialization,
 * error handling, and cross-tab synchronization.
 * 
 * @param key - The localStorage key to use
 * @param initializer - Function that takes the current localStorage value (string | null) and returns the initial state of type T
 * @returns Tuple containing [currentValue, controls] where controls has getItem, setItem, and deleteItem methods
 * 
 * @throws {Promise} When data is still loading (for Suspense)
 * @throws {Error} When initialization fails
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [count, { setItem, deleteItem }] = useSuspenseLocalStorageState(
 *     'my-counter',
 *     (currentValue) => currentValue ? parseInt(currentValue, 10) : 0
 *   );
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setItem(count + 1)}>Increment</button>
 *       <button onClick={deleteItem}>Reset</button>
 *     </div>
 *   );
 * }
 * 
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading...</div>}>
 *       <MyComponent />
 *     </Suspense>
 *   );
 * }
 * ```
 */
function useSuspenseLocalStorageState<T>(
    key: string,
    initializer: (currentValue: string | null) => T
): UseSuspenseLocalStorageStateReturnValue<T> {
    // Check if we already have a cache entry for this key
    let cacheEntry = cache.get(key) as CacheEntry<T> | undefined;

    if (!cacheEntry) {
        // Create new cache entry with promise
        const promise = createInitializationPromise(key, initializer);

        cacheEntry = {
            promise,
            status: 'pending'
        };

        cache.set(key, cacheEntry);

        // Handle promise resolution/rejection
        promise
            .then((result) => {
                const entry = cache.get(key) as CacheEntry<T>;
                if (entry) {
                    entry.status = 'resolved';
                    entry.result = result;
                }
            })
            .catch((error) => {
                const entry = cache.get(key) as CacheEntry<T>;
                if (entry) {
                    entry.status = 'rejected';
                    entry.error = error instanceof Error ? error : new Error(String(error));
                }
            });
    }

    // Handle different cache entry states
    if (cacheEntry.status === 'pending') {
        // Suspend by throwing the promise
        throw cacheEntry.promise;
    }

    if (cacheEntry.status === 'rejected') {
        // Re-throw the error to be caught by error boundary
        throw cacheEntry.error;
    }

    // At this point, we have a resolved value
    const initialValue = cacheEntry.result!;
    const [value, setValue] = useState<T>(initialValue);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    // Custom event name for cross-tab communication
    const customEventTypeName = useMemo(() => {
        return `rooks-${key}-localstorage-update`;
    }, [key]);

    // Effect to save value to localStorage when it changes
    useEffect(() => {
        // Don't save if the item was just deleted
        if (!isDeleted) {
            saveValueToLocalStorage(key, value);
        }
    }, [key, value, isDeleted]);

    // Cross-document storage event listener for tab synchronization
    const handleStorageEvent = useCallback(
        (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
                try {
                    if (event.newValue === null) {
                        // Item was removed, reset to initial value
                        const newValue = initializer(null);
                        setValue(newValue);
                    } else {
                        // Item was changed, re-initialize with new value
                        const newValue = initializer(event.newValue);
                        setValue(newValue);
                    }
                } catch (error) {
                    console.error(`Failed to handle storage event for key "${key}":`, error);
                }
            }
        },
        [key, initializer]
    );

    // Cross-document custom event listener for same-tab updates
    const handleCustomEvent = useCallback(
        (event: BroadcastCustomEvent<T>) => {
            try {
                const { newValue } = event.detail;
                setValue(newValue);
            } catch (error) {
                console.error(`Failed to handle custom event for key "${key}":`, error);
            }
        },
        [key]
    );

    // Set up cross-tab synchronization listeners
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("storage", handleStorageEvent);

            return () => {
                window.removeEventListener("storage", handleStorageEvent);
            };
        }
    }, [handleStorageEvent]);

    // Set up same-tab synchronization listeners
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.addEventListener(
                customEventTypeName,
                handleCustomEvent as EventListener
            );

            return () => {
                document.removeEventListener(
                    customEventTypeName,
                    handleCustomEvent as EventListener
                );
            };
        }
    }, [customEventTypeName, handleCustomEvent]);

    // Broadcast value changes within the same document
    const broadcastValueWithinDocument = useCallback(
        (newValue: T) => {
            if (typeof document !== "undefined") {
                const event: BroadcastCustomEvent<T> = new CustomEvent(
                    customEventTypeName,
                    { detail: { newValue } }
                );
                document.dispatchEvent(event);
            }
        },
        [customEventTypeName]
    );

    // Control methods
    const controls = useMemo<UseSuspenseLocalStorageStateControls<T>>(() => ({
        getItem: () => value,
        
        setItem: (newValue: T) => {
            setIsDeleted(false);
            setValue(newValue);
            broadcastValueWithinDocument(newValue);
        },
        
        deleteItem: () => {
            removeValueFromLocalStorage(key);
            const resetValue = initializer(null);
            setIsDeleted(true);
            setValue(resetValue);
            broadcastValueWithinDocument(resetValue);
        }
    }), [value, key, initializer, broadcastValueWithinDocument]);

    return [value, controls];
}

export { useSuspenseLocalStorageState };