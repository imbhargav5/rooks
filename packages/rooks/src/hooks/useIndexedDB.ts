import { useCallback, useEffect, useRef, useState } from "react";

interface IndexedDBError extends Error {
    code?: number;
}

// Define specific IDB event types
interface IDBRequestEvent extends Event {
    target: IDBRequest;
}

interface IDBVersionChangeEvent extends Event {
    target: IDBOpenDBRequest;
    oldVersion: number;
    newVersion: number | null;
}

type IndexedDBHandler<T> = {
    add: (item: T) => Promise<IDBValidKey>;
    get: (key: number | string) => Promise<T | undefined>;
    getAll: () => Promise<T[]>;
    update: (key: number | string, changes: Partial<T>) => Promise<void>;
    remove: (key: number | string) => Promise<void>;
    clear: () => Promise<void>;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useIndexedDB
 * @description A hook to work with IndexedDB for client-side storage
 * @param {string} dbName The name of the database
 * @param {string} storeName The name of the object store
 * @param {number} version The version of the database
 * @returns {IndexedDBHandler<T>} An object with methods to interact with IndexedDB
 * @see {@link https://rooks.vercel.app/docs/useIndexedDB}
 * 
 * @example
 * 
 * const { add, get, getAll, update, remove, clear, error, isSupported } = useIndexedDB<User>("myApp", "users", 1);
 * 
 * // Check if IndexedDB is supported
 * if (!isSupported) {
 *   return <div>IndexedDB is not supported in this environment</div>
 * }
 * 
 * // Add an item
 * add({ id: 1, name: "John", email: "john@example.com" });
 * 
 * // Get an item by key
 * get(1).then(user => console.log(user));
 * 
 * // Update an item
 * update(1, { name: "John Updated" });
 * 
 * // Remove an item
 * remove(1);
 */
function useIndexedDB<T>(
    dbName: string,
    storeName: string,
    version: number = 1
): IndexedDBHandler<T> {
    const [error, setError] = useState<Error | null>(null);
    const dbRef = useRef<IDBDatabase | null>(null);

    // Check if IndexedDB is supported in the current environment
    const isSupported = typeof window !== 'undefined' && 'indexedDB' in window;

    useEffect(() => {
        // Skip if IndexedDB is not supported (server-side rendering or unsupported browser)
        if (!isSupported) return;

        const openDB = (): void => {
            try {
                const request = indexedDB.open(dbName, version);

                request.onerror = (event) => {
                    const errorMessage = request.error?.message || "Unknown error";
                    setError(new Error(`IndexedDB error: ${errorMessage}`));
                };

                request.onupgradeneeded = (event) => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
                    }
                };

                request.onsuccess = () => {
                    dbRef.current = request.result;
                };
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(new Error(errorMessage));
            }
        };

        openDB();

        return () => {
            if (dbRef.current) {
                dbRef.current.close();
                dbRef.current = null;
            }
        };
    }, [dbName, storeName, version, isSupported]);

    const getObjectStore = useCallback(
        (mode: IDBTransactionMode = "readonly"): IDBObjectStore | null => {
            if (!isSupported) {
                setError(new Error("IndexedDB is not supported in this environment"));
                return null;
            }

            if (!dbRef.current) {
                setError(new Error("Database not initialized"));
                return null;
            }

            try {
                const transaction = dbRef.current.transaction(storeName, mode);
                return transaction.objectStore(storeName);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(new Error(errorMessage));
                return null;
            }
        },
        [storeName, isSupported]
    );

    const add = useCallback(
        async (item: T): Promise<IDBValidKey> => {
            return new Promise((resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                const store = getObjectStore("readwrite");
                if (!store) {
                    const storeError = new Error("Failed to get object store");
                    reject(storeError);
                    return;
                }

                const request = store.add(item);

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    const errorMessage = request.error?.message || "Unknown error";
                    const dbError = new Error(`Failed to add item: ${errorMessage}`);
                    setError(dbError);
                    reject(dbError);
                };
            });
        },
        [getObjectStore, isSupported]
    );

    const get = useCallback(
        async (key: number | string): Promise<T | undefined> => {
            return new Promise((resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                const store = getObjectStore();
                if (!store) {
                    const storeError = new Error("Failed to get object store");
                    reject(storeError);
                    return;
                }

                const request = store.get(key);

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    const errorMessage = request.error?.message || "Unknown error";
                    const dbError = new Error(`Failed to get item: ${errorMessage}`);
                    setError(dbError);
                    reject(dbError);
                };
            });
        },
        [getObjectStore, isSupported]
    );

    const getAll = useCallback(
        async (): Promise<T[]> => {
            return new Promise((resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                const store = getObjectStore();
                if (!store) {
                    const storeError = new Error("Failed to get object store");
                    reject(storeError);
                    return;
                }

                const request = store.getAll();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    const errorMessage = request.error?.message || "Unknown error";
                    const dbError = new Error(`Failed to get all items: ${errorMessage}`);
                    setError(dbError);
                    reject(dbError);
                };
            });
        },
        [getObjectStore, isSupported]
    );

    const update = useCallback(
        async (key: number | string, changes: Partial<T>): Promise<void> => {
            return new Promise(async (resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                try {
                    const item = await get(key);
                    if (!item) {
                        const notFoundError = new Error(`Item with key ${key} not found`);
                        throw notFoundError;
                    }

                    const store = getObjectStore("readwrite");
                    if (!store) {
                        const storeError = new Error("Failed to get object store");
                        reject(storeError);
                        return;
                    }

                    const updatedItem = { ...item, ...changes };
                    const request = store.put(updatedItem);

                    request.onsuccess = () => {
                        resolve();
                    };

                    request.onerror = () => {
                        const errorMessage = request.error?.message || "Unknown error";
                        const dbError = new Error(`Failed to update item: ${errorMessage}`);
                        setError(dbError);
                        reject(dbError);
                    };
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    const dbError = new Error(errorMessage);
                    setError(dbError);
                    reject(dbError);
                }
            });
        },
        [get, getObjectStore, isSupported]
    );

    const remove = useCallback(
        async (key: number | string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                const store = getObjectStore("readwrite");
                if (!store) {
                    const storeError = new Error("Failed to get object store");
                    reject(storeError);
                    return;
                }

                const request = store.delete(key);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    const errorMessage = request.error?.message || "Unknown error";
                    const dbError = new Error(`Failed to remove item: ${errorMessage}`);
                    setError(dbError);
                    reject(dbError);
                };
            });
        },
        [getObjectStore, isSupported]
    );

    const clear = useCallback(
        async (): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (!isSupported) {
                    const dbError = new Error("IndexedDB is not supported in this environment");
                    setError(dbError);
                    reject(dbError);
                    return;
                }

                const store = getObjectStore("readwrite");
                if (!store) {
                    const storeError = new Error("Failed to get object store");
                    reject(storeError);
                    return;
                }

                const request = store.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    const errorMessage = request.error?.message || "Unknown error";
                    const dbError = new Error(`Failed to clear store: ${errorMessage}`);
                    setError(dbError);
                    reject(dbError);
                };
            });
        },
        [getObjectStore, isSupported]
    );

    return {
        add,
        get,
        getAll,
        update,
        remove,
        clear,
        error,
        isSupported
    };
}

export { useIndexedDB }; 