import { renderHook, act } from '@testing-library/react-hooks';
// @ts-ignore - Ignore ESM/CommonJS module mismatch for testing
import "fake-indexeddb/auto";
// @ts-ignore - Ignore ESM/CommonJS module mismatch for testing
import { IDBFactory } from "fake-indexeddb";
import { useIndexedDB } from '@/hooks/useIndexedDB';

// Helper function to reset the database between tests
const resetIndexedDB = () => {
    // @ts-ignore - Ignore the readonly error for testing purposes
    global.indexedDB = new IDBFactory();
};

describe('useIndexedDB', () => {
    // Reset before each test
    beforeEach(() => {
        resetIndexedDB();
    });

    it('should be defined', () => {
        expect.hasAssertions();
        expect(useIndexedDB).toBeDefined();
    });

    it('should check if IndexedDB is supported', () => {
        expect.hasAssertions();

        // Test with IndexedDB support (using fake-indexeddb)
        const { result: resultWithSupport } = renderHook(() =>
            useIndexedDB('testDB', 'testStore', 1)
        );
        expect(resultWithSupport.current.isSupported).toBe(true);

        // Test without IndexedDB support by removing indexedDB
        const originalIndexedDB = global.indexedDB;
        // @ts-ignore - Intentionally removing indexedDB to test unsupported case
        delete global.indexedDB;

        const { result: resultWithoutSupport } = renderHook(() =>
            useIndexedDB('testDB', 'testStore', 1)
        );
        expect(resultWithoutSupport.current.isSupported).toBe(false);

        // Restore indexedDB for other tests
        global.indexedDB = originalIndexedDB;
    });

    it('should open a database connection on initialization', async () => {
        expect.hasAssertions();

        renderHook(() => useIndexedDB('testDB', 'testStore', 1));

        // Verify database was created by trying to open it directly
        const dbOpenRequest = indexedDB.open('testDB', 1);

        await new Promise<void>((resolve) => {
            dbOpenRequest.onsuccess = () => {
                expect(dbOpenRequest.result).toBeDefined();
                expect(dbOpenRequest.result.name).toBe('testDB');
                expect(dbOpenRequest.result.version).toBe(1);
                dbOpenRequest.result.close();
                resolve();
            };
        });
    });

    it('should add an item to the database', async () => {
        expect.hasAssertions();

        // Initialize the database with a store
        const dbSetupRequest = indexedDB.open('testDB', 1);
        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };
            dbSetupRequest.onsuccess = () => {
                dbSetupRequest.result.close();
                resolve();
            };
        });

        // Now use the hook
        const { result } = renderHook(() =>
            useIndexedDB<{ id?: number; name: string }>('testDB', 'testStore')
        );

        let addResult: IDBValidKey | undefined;
        await act(async () => {
            addResult = await result.current.add({ name: 'Test Item' });
        });

        // Expect add to return a key
        expect(addResult).toBeDefined();

        if (addResult) {
            // Verify the item was actually added by reading it back
            const verifyRequest = indexedDB.open('testDB', 1);
            await new Promise<void>((resolve) => {
                verifyRequest.onsuccess = () => {
                    const db = verifyRequest.result;
                    const transaction = db.transaction('testStore', 'readonly');
                    const store = transaction.objectStore('testStore');
                    const getRequest = store.get(addResult as IDBValidKey);

                    getRequest.onsuccess = () => {
                        expect(getRequest.result).toEqual({ id: addResult, name: 'Test Item' });
                        db.close();
                        resolve();
                    };
                };
            });
        }
    });

    it('should get an item from the database', async () => {
        expect.hasAssertions();

        // Setup: create database and add an item
        const dbSetupRequest = indexedDB.open('testDB', 1);
        let itemId: IDBValidKey | undefined;

        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };

            dbSetupRequest.onsuccess = () => {
                const db = dbSetupRequest.result;
                const tx = db.transaction('testStore', 'readwrite');
                const store = tx.objectStore('testStore');

                const addRequest = store.add({ name: 'Test Item' });
                addRequest.onsuccess = () => {
                    itemId = addRequest.result;
                    db.close();
                    resolve();
                };
            };
        });

        // Use the hook to get the item
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        let getResult;
        if (itemId !== undefined) {
            await act(async () => {
                getResult = await result.current.get(itemId as number);
            });

            expect(getResult).toEqual({ id: itemId, name: 'Test Item' });
        } else {
            fail('Failed to create test item in database');
        }
    });

    it('should get all items from the database', async () => {
        expect.hasAssertions();

        // Setup: create database and add multiple items
        const dbSetupRequest = indexedDB.open('testDB', 1);

        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };

            dbSetupRequest.onsuccess = () => {
                const db = dbSetupRequest.result;
                const tx = db.transaction('testStore', 'readwrite');
                const store = tx.objectStore('testStore');

                store.add({ name: 'Item 1' });
                store.add({ name: 'Item 2' });

                tx.oncomplete = () => {
                    db.close();
                    resolve();
                };
            };
        });

        // Use the hook to get all items
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        let getAllResult: Array<{ id: number; name: string }> | undefined;
        await act(async () => {
            getAllResult = await result.current.getAll();
        });

        expect(getAllResult).toBeDefined();
        if (getAllResult && getAllResult.length >= 2) {
            expect(getAllResult.length).toBe(2);
            expect(getAllResult[0]?.name).toBe('Item 1');
            expect(getAllResult[1]?.name).toBe('Item 2');
        } else {
            fail('Expected at least 2 items in database');
        }
    });

    it('should update an item in the database', async () => {
        expect.hasAssertions();

        // Setup: create database and add an item
        const dbSetupRequest = indexedDB.open('testDB', 1);
        let itemId: IDBValidKey | undefined;

        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };

            dbSetupRequest.onsuccess = () => {
                const db = dbSetupRequest.result;
                const tx = db.transaction('testStore', 'readwrite');
                const store = tx.objectStore('testStore');

                const addRequest = store.add({ name: 'Original Name' });
                addRequest.onsuccess = () => {
                    itemId = addRequest.result;
                    db.close();
                    resolve();
                };
            };
        });

        if (itemId === undefined) {
            fail('Failed to create test item in database');
            return;
        }

        // Use the hook to update the item
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        await act(async () => {
            await result.current.update(itemId as number, { name: 'Updated Name' });
        });

        // Verify the update worked
        const verifyRequest = indexedDB.open('testDB', 1);
        await new Promise<void>((resolve) => {
            verifyRequest.onsuccess = () => {
                const db = verifyRequest.result;
                const transaction = db.transaction('testStore', 'readonly');
                const store = transaction.objectStore('testStore');
                const getRequest = store.get(itemId as IDBValidKey);

                getRequest.onsuccess = () => {
                    expect(getRequest.result).toEqual({ id: itemId, name: 'Updated Name' });
                    db.close();
                    resolve();
                };
            };
        });
    });

    it('should remove an item from the database', async () => {
        expect.hasAssertions();

        // Setup: create database and add an item
        const dbSetupRequest = indexedDB.open('testDB', 1);
        let itemId: IDBValidKey | undefined;

        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };

            dbSetupRequest.onsuccess = () => {
                const db = dbSetupRequest.result;
                const tx = db.transaction('testStore', 'readwrite');
                const store = tx.objectStore('testStore');

                const addRequest = store.add({ name: 'Item to Delete' });
                addRequest.onsuccess = () => {
                    itemId = addRequest.result;
                    db.close();
                    resolve();
                };
            };
        });

        if (itemId === undefined) {
            fail('Failed to create test item in database');
            return;
        }

        // Use the hook to remove the item
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        await act(async () => {
            await result.current.remove(itemId as number);
        });

        // Verify the item was deleted
        const verifyRequest = indexedDB.open('testDB', 1);
        await new Promise<void>((resolve) => {
            verifyRequest.onsuccess = () => {
                const db = verifyRequest.result;
                const transaction = db.transaction('testStore', 'readonly');
                const store = transaction.objectStore('testStore');
                const getRequest = store.get(itemId as IDBValidKey);

                getRequest.onsuccess = () => {
                    expect(getRequest.result).toBeUndefined();
                    db.close();
                    resolve();
                };
            };
        });
    });

    it('should clear all items from the database', async () => {
        expect.hasAssertions();

        // Setup: create database and add multiple items
        const dbSetupRequest = indexedDB.open('testDB', 1);

        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                const db = dbSetupRequest.result;
                db.createObjectStore('testStore', { keyPath: 'id', autoIncrement: true });
            };

            dbSetupRequest.onsuccess = () => {
                const db = dbSetupRequest.result;
                const tx = db.transaction('testStore', 'readwrite');
                const store = tx.objectStore('testStore');

                store.add({ name: 'Item 1' });
                store.add({ name: 'Item 2' });

                tx.oncomplete = () => {
                    db.close();
                    resolve();
                };
            };
        });

        // Verify items were added
        const countRequest = indexedDB.open('testDB', 1);
        await new Promise<void>((resolve) => {
            countRequest.onsuccess = () => {
                const db = countRequest.result;
                const tx = db.transaction('testStore', 'readonly');
                const store = tx.objectStore('testStore');
                const countReq = store.count();

                countReq.onsuccess = () => {
                    expect(countReq.result).toBe(2);
                    db.close();
                    resolve();
                };
            };
        });

        // Use the hook to clear all items
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        await act(async () => {
            await result.current.clear();
        });

        // Verify all items were cleared
        const verifyRequest = indexedDB.open('testDB', 1);
        await new Promise<void>((resolve) => {
            verifyRequest.onsuccess = () => {
                const db = verifyRequest.result;
                const transaction = db.transaction('testStore', 'readonly');
                const store = transaction.objectStore('testStore');
                const countReq = store.count();

                countReq.onsuccess = () => {
                    expect(countReq.result).toBe(0);
                    db.close();
                    resolve();
                };
            };
        });
    });

    it('should handle errors when performing database operations', async () => {
        expect.hasAssertions();

        // Create a database without the required object store
        const dbSetupRequest = indexedDB.open('errorDB', 1);
        await new Promise<void>((resolve) => {
            dbSetupRequest.onupgradeneeded = () => {
                // Not creating any object store
                const db = dbSetupRequest.result;
                // Intentionally not creating 'testStore'
            };
            dbSetupRequest.onsuccess = () => {
                dbSetupRequest.result.close();
                resolve();
            };
        });

        // Use the hook with a non-existent object store
        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('errorDB', 'nonExistentStore')
        );

        await act(async () => {
            try {
                await result.current.add({ id: 1, name: 'Test Item' });
                // Should not reach here
                expect(false).toBe(true);
            } catch (error) {
                // Should catch error
                expect(error).toBeDefined();
                expect(result.current.error).toBeDefined();
            }
        });
    });

    it('should gracefully handle unsupported environment', async () => {
        expect.hasAssertions();

        // Remove IndexedDB support
        const originalIndexedDB = global.indexedDB;
        // @ts-ignore - Intentionally removing indexedDB to test unsupported case
        delete global.indexedDB;

        const { result } = renderHook(() =>
            useIndexedDB<{ id: number; name: string }>('testDB', 'testStore')
        );

        expect(result.current.isSupported).toBe(false);

        // Operations should fail gracefully
        await act(async () => {
            try {
                await result.current.add({ id: 1, name: 'Test Item' });
                // Should not reach here
                expect(false).toBe(true);
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).toContain('not supported');
                }
            }
        });

        // Restore for other tests
        global.indexedDB = originalIndexedDB;
    });
}); 