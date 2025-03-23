import { useCallback, useEffect, useState } from "react";

export type PushSubscriptionOptions = PushSubscriptionOptionsInit;

export type PushSubscriptionHandler = {
    subscribe: (options?: PushSubscriptionOptions) => Promise<PushSubscription | null>;
    unsubscribe: () => Promise<boolean>;
    subscription: PushSubscription | null;
    permissionState: NotificationPermission;
    error: Error | null;
    isSupported: boolean;
    updateSubscription: (options?: PushSubscriptionOptions) => Promise<PushSubscription | null>;
};

export type UrlB64ToUint8ArrayOptions = {
    padding?: boolean;
};

/**
 * Convert a base64 string to a Uint8Array
 * Utility function for VAPID key conversion
 */
function urlB64ToUint8Array(base64String: string, options: UrlB64ToUint8ArrayOptions = {}): Uint8Array {
    const { padding = true } = options;
    const base64 = padding
        ? base64String.replace(/-/g, "+").replace(/_/g, "/")
        : base64String;

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

/**
 * usePushSubscription
 * @description A hook for the Push API
 * @param {string} publicKey VAPID public key for push subscription
 * @returns {PushSubscriptionHandler} Methods and state for push subscription management
 * @see {@link https://rooks.vercel.app/docs/usePushSubscription}
 *
 * @example
 *
 * const { 
 *   subscribe, 
 *   unsubscribe, 
 *   subscription, 
 *   permissionState 
 * } = usePushSubscription("YOUR_PUBLIC_VAPID_KEY");
 *
 * // Subscribe to push notifications
 * subscribe().then(sub => {
 *   // Send subscription to server
 *   saveSubscriptionToServer(sub);
 * });
 */
function usePushSubscription(publicKey?: string): PushSubscriptionHandler {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
    const [error, setError] = useState<Error | null>(null);

    const isSupported = typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window;

    // Get the current permission state
    useEffect(() => {
        if (!isSupported) {
            return;
        }

        // Check notification permission
        if ("Notification" in window) {
            setPermissionState(Notification.permission);
        }

        // Get existing subscription if any
        const getExistingSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
                setSubscription(existingSubscription);
            } catch (err) {
                // Silently fail for initial check
            }
        };

        getExistingSubscription();
    }, [isSupported]);

    // Request push notification permission and subscribe
    const subscribe = useCallback(async (options: PushSubscriptionOptions = {}): Promise<PushSubscription | null> => {
        if (!isSupported) {
            const error = new Error("Push API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            // Request notification permission if needed
            if (permissionState !== "granted") {
                const permission = await Notification.requestPermission();
                setPermissionState(permission);

                if (permission !== "granted") {
                    throw new Error("Notification permission denied");
                }
            }

            // Wait for service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Prepare subscription options
            const subscriptionOptions: PushSubscriptionOptions = {
                userVisibleOnly: true,
                ...options
            };

            // Add applicationServerKey if public key is provided
            if (publicKey) {
                subscriptionOptions.applicationServerKey = urlB64ToUint8Array(publicKey);
            }

            // Subscribe to push
            const pushSubscription = await registration.pushManager.subscribe(subscriptionOptions);

            setSubscription(pushSubscription);
            return pushSubscription;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, permissionState, publicKey]);

    // Update an existing subscription
    const updateSubscription = useCallback(async (options: PushSubscriptionOptions = {}): Promise<PushSubscription | null> => {
        if (!isSupported) {
            const error = new Error("Push API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            // If already subscribed, unsubscribe first
            if (subscription) {
                await subscription.unsubscribe();
            }

            // Create a new subscription
            return await subscribe(options);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, subscription, subscribe]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!isSupported || !subscription) {
            return false;
        }

        try {
            const success = await subscription.unsubscribe();
            if (success) {
                setSubscription(null);
            }
            return success;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported, subscription]);

    return {
        subscribe,
        unsubscribe,
        subscription,
        permissionState,
        error,
        isSupported,
        updateSubscription
    };
}

export { usePushSubscription }; 