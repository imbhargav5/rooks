import { useCallback, useEffect, useRef, useState } from "react";

export type NotificationOptions = {
    body?: string;
    icon?: string;
    image?: string;
    badge?: string;
    vibrate?: number[];
    sound?: string;
    dir?: "auto" | "ltr" | "rtl";
    lang?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    renotify?: boolean;
    silent?: boolean;
    timestamp?: number;
    actions?: NotificationAction[];
};

export type NotificationAction = {
    action: string;
    title: string;
    icon?: string;
};

export type NotificationEvents = {
    onClick?: (event: Event) => void;
    onClose?: (event: Event) => void;
    onError?: (event: Event) => void;
    onShow?: (event: Event) => void;
};

export type NotificationsHandler = {
    requestPermission: () => Promise<NotificationPermission>;
    showNotification: (title: string, options?: NotificationOptions, events?: NotificationEvents) => Notification | null;
    closeAll: () => void;
    permissionState: NotificationPermission;
    supported: boolean;
    error: Error | null;
};

/**
 * useNotifications
 * @description A hook for the Web Notifications API
 * @returns {NotificationsHandler} Methods and state for notification management
 * @see {@link https://rooks.vercel.app/docs/useNotifications}
 *
 * @example
 *
 * const { 
 *   requestPermission, 
 *   showNotification, 
 *   permissionState, 
 *   closeAll 
 * } = useNotifications();
 *
 * // Request permission
 * requestPermission().then(state => {
 *   if (state === "granted") {
 *     showNotification("New Message", {
 *       body: "You have a new message",
 *       icon: "/notification-icon.png"
 *     });
 *   }
 * });
 */
function useNotifications(): NotificationsHandler {
    const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
    const [error, setError] = useState<Error | null>(null);
    const [supported, setSupported] = useState<boolean>(false);
    const activeNotifications = useRef<Notification[]>([]);

    // Check if Notifications API is supported
    useEffect(() => {
        const isSupported = typeof window !== "undefined" && "Notification" in window;
        setSupported(isSupported);

        if (isSupported && "permission" in Notification) {
            setPermissionState(Notification.permission);
        }
    }, []);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
        if (!supported) {
            const error = new Error("Notifications API is not supported in this browser");
            setError(error);
            return "denied";
        }

        try {
            const permission = await Notification.requestPermission();
            setPermissionState(permission);
            return permission;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return "denied";
        }
    }, [supported]);

    // Show a notification
    const showNotification = useCallback(
        (title: string, options: NotificationOptions = {}, events: NotificationEvents = {}): Notification | null => {
            if (!supported) {
                setError(new Error("Notifications API is not supported in this browser"));
                return null;
            }

            if (permissionState !== "granted") {
                setError(new Error("Notification permission not granted"));
                return null;
            }

            try {
                const notification = new Notification(title, options);

                if (events.onClick) {
                    notification.onclick = events.onClick;
                }

                if (events.onClose) {
                    notification.onclose = events.onClose;
                }

                if (events.onError) {
                    notification.onerror = events.onError;
                }

                if (events.onShow) {
                    notification.onshow = events.onShow;
                }

                // Store notification for later access
                activeNotifications.current.push(notification);

                return notification;
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
                return null;
            }
        },
        [supported, permissionState]
    );

    // Close all active notifications
    const closeAll = useCallback(() => {
        if (!supported) {
            return;
        }

        activeNotifications.current.forEach((notification) => {
            notification.close();
        });

        activeNotifications.current = [];
    }, [supported]);

    return {
        requestPermission,
        showNotification,
        closeAll,
        permissionState,
        supported,
        error
    };
}

export { useNotifications }; 