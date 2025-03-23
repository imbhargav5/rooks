import { useCallback, useEffect, useState } from "react";

export type ServiceWorkerHandler = {
    registration: ServiceWorkerRegistration | null;
    error: Error | null;
    update: () => Promise<void>;
    unregister: () => Promise<boolean>;
    isUpdateAvailable: boolean;
};

/**
 * useServiceWorker
 * @description A hook to register and communicate with service workers
 * @param {string} scriptURL The URL of the service worker script
 * @param {RegistrationOptions} options Options for service worker registration
 * @returns {ServiceWorkerHandler} Methods and state for service worker management
 * @see {@link https://rooks.vercel.app/docs/useServiceWorker}
 *
 * @example
 *
 * const { 
 *   registration, 
 *   error, 
 *   update, 
 *   unregister, 
 *   isUpdateAvailable 
 * } = useServiceWorker("/service-worker.js");
 *
 * // Check for updates
 * if (isUpdateAvailable) {
 *   update();
 * }
 */
function useServiceWorker(
    scriptURL: string,
    options: RegistrationOptions = {}
): ServiceWorkerHandler {
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);

    const registerServiceWorker = useCallback(async () => {
        if (!("serviceWorker" in navigator)) {
            setError(new Error("Service Worker API is not supported in current browser"));
            return;
        }

        try {
            const reg = await navigator.serviceWorker.register(scriptURL, options);
            setRegistration(reg);

            // Check if there's a waiting service worker
            if (reg.waiting) {
                setIsUpdateAvailable(true);
            }

            // Listen for new service workers
            reg.addEventListener("updatefound", () => {
                const newWorker = reg.installing;

                if (!newWorker) return;

                newWorker.addEventListener("statechange", () => {
                    // New service worker is installed and waiting
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                        setIsUpdateAvailable(true);
                    }
                });
            });

            // Listen for controller change
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                // The new service worker has taken control
                setIsUpdateAvailable(false);
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [scriptURL, options]);

    const update = useCallback(async (): Promise<void> => {
        if (!registration) {
            setError(new Error("No service worker registration available"));
            return;
        }

        try {
            // Check for updates
            await registration.update();

            // If a waiting worker exists, activate it
            if (registration.waiting) {
                // PostMessage is used to communicate with the service worker
                // The service worker needs to listen for this message and call skipWaiting()
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [registration]);

    const unregister = useCallback(async (): Promise<boolean> => {
        if (!registration) {
            setError(new Error("No service worker registration available"));
            return false;
        }

        try {
            const result = await registration.unregister();
            setRegistration(null);
            setIsUpdateAvailable(false);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return false;
        }
    }, [registration]);

    // Register the service worker when the component mounts
    useEffect(() => {
        registerServiceWorker();
    }, [registerServiceWorker]);

    return {
        registration,
        error,
        update,
        unregister,
        isUpdateAvailable
    };
}

export { useServiceWorker }; 