/**
 * useSuspenseIndexedDBState
 * @description Suspense-enabled hook for IndexedDB state management with cross-tab synchronization
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseIndexedDBState}
 */

/// <reference lib="dom" />

import { useState, useCallback, useMemo, useRef } from "react";
import { useBroadcastChannel } from "./useBroadcastChannel";

// Cache entry interface for managing IndexedDB promises and results
interface CacheEntry<T> {
    promise: Promise<T>;
    status: 'pending' | 'resolved' | 'rejected';
    result?: T;
    error?: Error;
}

// Cache for storing promises and results indexed by database + store + key
const cache: Map<string, CacheEntry<unknown>> = new Map();

/**
 * Clear cached entry for a specific cache key - useful for testing
 * @internal
 * @param cacheKey - The cache key to clear
 */
export function clearCache(cacheKey?: string) {
    if (cacheKey) {
        cache.delete(cacheKey);
    } else {
        cache.clear();
    }
}

/**
 * Check if IndexedDB is supported in the current environment
 * @returns boolean indicating IndexedDB support
 */
function isIndexedDBSupported(): boolean {
    return typeof indexedDB !== "undefined";
}

/**
 * Opens or creates an IndexedDB database
 * @param dbName - The database name
 * @param version - The database version
 * @param storeName - The object store name
 * @returns Promise that resolves to the database instance
 */
function openDatabase(dbName: string, version: number, storeName: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (!isIndexedDBSupported()) {
            reject(new Error("IndexedDB is not supported in this environment"));
            return;
        }

        const request = indexedDB.open(dbName, version);

        request.onerror = () => {
            reject(new Error(`Failed to open database "${dbName}": ${request.error?.message}`));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
}

/**
 * Gets value from IndexedDB with error handling
 * @param dbName - The database name
 * @param storeName - The object store name
 * @param key - The key to retrieve
 * @param version - The database version
 * @returns Promise that resolves to the value or null if not found
 */
async function getValueFromIndexedDB<T>(
    dbName: string,
    storeName: string,
    key: string,
    version: number
): Promise<T | null> {
    try {
        const db = await openDatabase(dbName, version, storeName);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onerror = () => {
                reject(new Error(`Failed to get value for key "${key}": ${request.error?.message}`));
            };

            request.onsuccess = () => {
                resolve(request.result ?? null);
            };

            transaction.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Failed to get value from IndexedDB for key "${key}":`, error);
        return null;
    }
}

/**
 * Saves value to IndexedDB with error handling
 * @param dbName - The database name
 * @param storeName - The object store name
 * @param key - The key to store under
 * @param value - The value to store
 * @param version - The database version
 */
async function saveValueToIndexedDB<T>(
    dbName: string,
    storeName: string,
    key: string,
    value: T,
    version: number
): Promise<void> {
    try {
        const db = await openDatabase(dbName, version, storeName);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(value, key);

            request.onerror = () => {
                reject(new Error(`Failed to save value for key "${key}": ${request.error?.message}`));
            };

            request.onsuccess = () => {
                resolve();
            };

            transaction.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Failed to save value to IndexedDB for key "${key}":`, error);
        throw error;
    }
}

/**
 * Removes value from IndexedDB with error handling
 * @param dbName - The database name
 * @param storeName - The object store name
 * @param key - The key to remove
 * @param version - The database version
 */
async function removeValueFromIndexedDB(
    dbName: string,
    storeName: string,
    key: string,
    version: number
): Promise<void> {
    try {
        const db = await openDatabase(dbName, version, storeName);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onerror = () => {
                reject(new Error(`Failed to remove value for key "${key}": ${request.error?.message}`));
            };

            request.onsuccess = () => {
                resolve();
            };

            transaction.oncomplete = () => {
                db.close();
            };
        });
    } catch (error) {
        console.error(`Failed to remove value from IndexedDB for key "${key}":`, error);
        throw error;
    }
}

/**
 * Creates a promise that resolves with the initialized value from IndexedDB
 * @param dbName - The database name
 * @param storeName - The object store name
 * @param key - The key to retrieve
 * @param version - The database version
 * @param initializer - Function to transform raw IndexedDB value into typed value
 * @returns Promise that resolves to the initialized value
 */
function createInitializationPromise<T>(
    dbName: string,
    storeName: string,
    key: string,
    version: number,
    initializer: (currentValue: unknown) => T
): Promise<T> {
    return new Promise((resolve, reject) => {
        getValueFromIndexedDB(dbName, storeName, key, version)
            .then((rawValue) => {
                try {
                    const initializedValue = initializer(rawValue);
                    resolve(initializedValue);
                } catch (error) {
                    reject(error instanceof Error ? error : new Error(String(error)));
                }
            })
            .catch((error) => {
                reject(error instanceof Error ? error : new Error(String(error)));
            });
    });
}

/**
 * Control methods interface for the hook
 */
interface UseSuspenseIndexedDBStateControls<T> {
    /**
     * Get the current value from the hook's state
     * @returns The current state value
     */
    getItem: () => T;

    /**
     * Set a new value in IndexedDB and update state
     * @param value - The new value to set
     */
    setItem: (value: T) => Promise<void>;

    /**
     * Delete the item from IndexedDB and reset to initial value
     */
    deleteItem: () => Promise<void>;
}

/**
 * Return type for the useSuspenseIndexedDBState hook
 */
type UseSuspenseIndexedDBStateReturnValue<T> = [
    T,
    UseSuspenseIndexedDBStateControls<T>
];

/**
 * Broadcast message type for cross-tab communication
 */
interface BroadcastMessage<T> {
    type: 'SET' | 'DELETE';
    key: string;
    value?: T;
    dbName: string;
    storeName: string;
}

/**
 * Hook configuration interface
 */
interface IndexedDBConfig {
    /**
     * The IndexedDB database name
     * @default "rooks-db"
     */
    dbName?: string;

    /**
     * The object store name within the database
     * @default "state"
     */
    storeName?: string;

    /**
     * The database version
     * @default 1
     */
    version?: number;
}

/**
 * Suspense-enabled hook for IndexedDB state management with cross-tab synchronization
 * 
 * This hook will suspend (throw a promise) during initialization to work with React Suspense.
 * It provides IndexedDB state management with proper TypeScript generics, structured data storage,
 * error handling, and cross-tab synchronization using BroadcastChannel API.
 * 
 * @param key - The key to use within the IndexedDB object store
 * @param initializer - Function that takes the current IndexedDB value (unknown type) and returns the initial state of type T
 * @param config - Optional configuration for database name, store name, and version
 * @returns Tuple containing [currentValue, controls] where controls has getItem, setItem, and deleteItem methods
 * 
 * @throws {Promise} When data is still loading (for Suspense)
 * @throws {Error} When initialization fails
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [user, { setItem, deleteItem }] = useSuspenseIndexedDBState(
 *     'user-profile',
 *     (currentValue) => currentValue || { id: 0, name: 'Guest', email: '' }
 *   );
 *   
 *   return (
 *     <div>
 *       <p>User: {user.name}</p>
 *       <button onClick={() => setItem({ id: 1, name: 'John', email: 'john@example.com' })}>
 *         Update User
 *       </button>
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
function useSuspenseIndexedDBState<T>(
    key: string,
    initializer: (currentValue: unknown) => T,
    config: IndexedDBConfig = {}
): UseSuspenseIndexedDBStateReturnValue<T> {
    const {
        dbName = "rooks-db",
        storeName = "state",
        version = 1
    } = config;

    // Create a unique cache key combining database info and key
    const cacheKey = `${dbName}:${storeName}:${key}:${version}`;

    // Check if we already have a cache entry for this key
    let cacheEntry = cache.get(cacheKey) as CacheEntry<T> | undefined;

    if (!cacheEntry) {
        // Create new cache entry with promise
        const promise = createInitializationPromise(dbName, storeName, key, version, initializer);

        cacheEntry = {
            promise,
            status: 'pending'
        };

        cache.set(cacheKey, cacheEntry);

        // Handle promise resolution/rejection
        promise
            .then((result) => {
                const entry = cache.get(cacheKey) as CacheEntry<T>;
                if (entry) {
                    entry.status = 'resolved';
                    entry.result = result;
                }
            })
            .catch((error) => {
                const entry = cache.get(cacheKey) as CacheEntry<T>;
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

    // Create broadcast channel name for cross-tab communication
    const channelName = useMemo(() => {
        return `rooks-indexeddb-${dbName}-${storeName}`;
    }, [dbName, storeName]);

    // Store the initializer in a ref to avoid recreating the callback
    const initializerRef = useRef(initializer);
    initializerRef.current = initializer;

    // Handle broadcast messages from other tabs
    const handleBroadcastMessage = useCallback(
        (data: BroadcastMessage<T>) => {
            const { type, key: messageKey, value: messageValue, dbName: msgDbName, storeName: msgStoreName } = data;

            // Only handle messages for the same database, store, and key
            if (msgDbName === dbName && msgStoreName === storeName && messageKey === key) {
                try {
                    if (type === 'SET' && messageValue !== undefined) {
                        setValue(messageValue);
                        // Update cache with the new value to maintain consistency
                        const entry = cache.get(cacheKey) as CacheEntry<T>;
                        if (entry && entry.status === 'resolved') {
                            entry.result = messageValue;
                        }
                    } else if (type === 'DELETE') {
                        const resetValue = initializerRef.current(null);
                        setValue(resetValue);
                        // Update cache with the reset value
                        const entry = cache.get(cacheKey) as CacheEntry<T>;
                        if (entry && entry.status === 'resolved') {
                            entry.result = resetValue;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to handle broadcast message for key "${key}":`, error);
                }
            }
        },
        [dbName, storeName, key, cacheKey]
    );

    // Use our useBroadcastChannel hook for cross-tab communication
    const { postMessage: broadcastMessage, isSupported: isBroadcastSupported } = useBroadcastChannel<BroadcastMessage<T>>(
        channelName,
        {
            onMessage: handleBroadcastMessage,
            onError: (error) => {
                console.error(`BroadcastChannel error for key "${key}":`, error);
            }
        }
    );

    // Broadcast value changes to other tabs
    const broadcastChange = useCallback(
        (type: 'SET' | 'DELETE', newValue?: T) => {
            if (isBroadcastSupported) {
                const message: BroadcastMessage<T> = {
                    type,
                    key,
                    value: newValue,
                    dbName,
                    storeName
                };
                broadcastMessage(message);
            }
        },
        [broadcastMessage, isBroadcastSupported, key, dbName, storeName]
    );

    // Control methods
    const controls = useMemo<UseSuspenseIndexedDBStateControls<T>>(() => ({
        getItem: () => value,

        setItem: async (newValue: T) => {
            try {
                await saveValueToIndexedDB(dbName, storeName, key, newValue, version);
                setValue(newValue);
                broadcastChange('SET', newValue);
            } catch (error) {
                console.error(`Failed to set item in IndexedDB for key "${key}":`, error);
                throw error;
            }
        },

        deleteItem: async () => {
            try {
                await removeValueFromIndexedDB(dbName, storeName, key, version);
                const resetValue = initializerRef.current(null);
                setValue(resetValue);
                broadcastChange('DELETE');
            } catch (error) {
                console.error(`Failed to delete item from IndexedDB for key "${key}":`, error);
                throw error;
            }
        }
    }), [value, dbName, storeName, key, version, broadcastChange]);

    return [value, controls];
}

export { useSuspenseIndexedDBState };