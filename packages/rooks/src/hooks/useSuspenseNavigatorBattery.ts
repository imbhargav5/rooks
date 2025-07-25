/**
 * useSuspenseNavigatorBattery
 * @description Suspense-enabled hook for getting battery status information from Navigator Battery API
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorBattery}
 */

/// <reference lib="dom" />

import { useState, useEffect } from "react";

// BatteryManager interface from Web API specification
interface BatteryManager extends EventTarget {
    readonly charging: boolean;
    readonly chargingTime: number;
    readonly dischargingTime: number;
    readonly level: number;
}

// Extend Navigator interface to include getBattery
declare global {
    interface Navigator {
        getBattery?(): Promise<BatteryManager>;
    }
}

// Cache entry interface
interface CacheEntry {
    promise: Promise<BatteryManager>;
    status: 'pending' | 'resolved' | 'rejected';
    result?: BatteryManager;
    error?: Error;
}

// Cache for storing promise and result - only one entry needed since there are no parameters
let cacheEntry: CacheEntry | null = null;

/**
 * Clear cached entry - useful for testing
 * @internal
 */
export function clearCache() {
    cacheEntry = null;
}

/**
 * Suspense-enabled hook for getting battery status information from Navigator Battery API
 * 
 * This hook will suspend (throw a promise) while the Navigator Battery API
 * is fetching battery information. It should be wrapped in a Suspense boundary.
 * The hook provides real-time updates when battery status changes.
 * 
 * @returns The BatteryManager object with current battery status information
 * 
 * @throws {Error} When Navigator Battery API is not supported
 * @throws {Promise} When data is still loading (for Suspense)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const battery = useSuspenseNavigatorBattery();
 *   
 *   return (
 *     <div>
 *       <p>Battery Level: {Math.round(battery.level * 100)}%</p>
 *       <p>Charging: {battery.charging ? 'Yes' : 'No'}</p>
 *       <p>Charging Time: {battery.chargingTime} seconds</p>
 *       <p>Discharging Time: {battery.dischargingTime} seconds</p>
 *     </div>
 *   );
 * }
 * 
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading battery info...</div>}>
 *       <MyComponent />
 *     </Suspense>
 *   );
 * }
 * ```
 */
function useSuspenseNavigatorBattery(): BatteryManager {
    // Check if Navigator Battery API is supported
    if (typeof navigator === "undefined" || !navigator.getBattery) {
        throw new Error(
            "Navigator Battery API is not supported in this browser. " +
            "This API requires HTTPS and is not supported in all browsers."
        );
    }

    // State to track the current battery status
    const [batteryState, setBatteryState] = useState<BatteryManager | null>(null);

    // Check if we already have a cache entry
    if (!cacheEntry) {
        // Create new cache entry with promise
        const promise = navigator.getBattery();

        cacheEntry = {
            promise,
            status: 'pending'
        };

        // Handle promise resolution/rejection
        promise
            .then((result) => {
                cacheEntry!.status = 'resolved';
                cacheEntry!.result = result;
            })
            .catch((error) => {
                cacheEntry!.status = 'rejected';
                cacheEntry!.error = error instanceof Error ? error : new Error(String(error));
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

    const initialBattery = cacheEntry.result!;

    // Set up event listeners for battery status changes
    useEffect(() => {
        if (!initialBattery) return;

        // Initialize state with current battery values
        setBatteryState({
            charging: initialBattery.charging,
            chargingTime: initialBattery.chargingTime,
            dischargingTime: initialBattery.dischargingTime,
            level: initialBattery.level,
            addEventListener: initialBattery.addEventListener.bind(initialBattery),
            removeEventListener: initialBattery.removeEventListener.bind(initialBattery),
        } as BatteryManager);

        // Event handlers to update state when battery properties change
        const handleChargingChange = () => {
            setBatteryState((prev: BatteryManager | null) => prev ? {
                ...prev,
                charging: initialBattery.charging
            } : null);
        };

        const handleChargingTimeChange = () => {
            setBatteryState((prev: BatteryManager | null) => prev ? {
                ...prev,
                chargingTime: initialBattery.chargingTime
            } : null);
        };

        const handleDischargingTimeChange = () => {
            setBatteryState((prev: BatteryManager | null) => prev ? {
                ...prev,
                dischargingTime: initialBattery.dischargingTime
            } : null);
        };

        const handleLevelChange = () => {
            setBatteryState((prev: BatteryManager | null) => prev ? {
                ...prev,
                level: initialBattery.level
            } : null);
        };

        // Add event listeners
        initialBattery.addEventListener('chargingchange', handleChargingChange);
        initialBattery.addEventListener('chargingtimechange', handleChargingTimeChange);
        initialBattery.addEventListener('dischargingtimechange', handleDischargingTimeChange);
        initialBattery.addEventListener('levelchange', handleLevelChange);

        // Cleanup function to remove event listeners
        return () => {
            initialBattery.removeEventListener('chargingchange', handleChargingChange);
            initialBattery.removeEventListener('chargingtimechange', handleChargingTimeChange);
            initialBattery.removeEventListener('dischargingtimechange', handleDischargingTimeChange);
            initialBattery.removeEventListener('levelchange', handleLevelChange);
        };
    }, [initialBattery]);

    // Return the current battery state or initial battery if state hasn't been set yet
    return batteryState || initialBattery;
}

export { useSuspenseNavigatorBattery }; 