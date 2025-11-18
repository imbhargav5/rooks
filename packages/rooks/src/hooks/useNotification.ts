import { useState, useCallback, useEffect } from "react";

/**
 * Notification permission state
 */
type NotificationPermission = "default" | "granted" | "denied";

/**
 * Options for showing a notification
 */
interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number | number[];
  image?: string;
}

/**
 * Return value for the useNotification hook
 */
interface UseNotificationReturnValue {
  /**
   * Show a notification
   * @param title - The notification title
   * @param options - Notification options
   * @returns The created Notification instance or null if not supported
   */
  show: (
    title: string,
    options?: NotificationOptions
  ) => Promise<Notification | null>;
  /**
   * Current permission state
   */
  permission: NotificationPermission;
  /**
   * Request notification permission from the user
   * @returns Promise that resolves with the permission state
   */
  requestPermission: () => Promise<NotificationPermission>;
  /**
   * Whether the Notification API is supported
   */
  isSupported: boolean;
}

/**
 * useNotification hook
 *
 * Send browser notifications with permission handling.
 * Provides methods to request permission and show notifications with various options.
 *
 * @returns Object containing notification operations and state
 *
 * @example
 * ```tsx
 * import { useNotification } from "rooks";
 *
 * function NotificationDemo() {
 *   const { show, permission, requestPermission, isSupported } = useNotification();
 *
 *   const handleRequestPermission = async () => {
 *     const result = await requestPermission();
 *     console.log("Permission:", result);
 *   };
 *
 *   const handleShowNotification = async () => {
 *     if (permission === "granted") {
 *       await show("Hello!", {
 *         body: "This is a notification from your app",
 *         icon: "/icon.png",
 *         tag: "demo",
 *       });
 *     }
 *   };
 *
 *   if (!isSupported) {
 *     return <div>Notifications not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Permission: {permission}</p>
 *       {permission === "default" && (
 *         <button onClick={handleRequestPermission}>Request Permission</button>
 *       )}
 *       {permission === "granted" && (
 *         <button onClick={handleShowNotification}>Show Notification</button>
 *       )}
 *       {permission === "denied" && <p>Permission denied</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useNotification
 */
function useNotification(): UseNotificationReturnValue {
  const isSupported =
    typeof window !== "undefined" && "Notification" in window;

  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? (Notification.permission as NotificationPermission) : "default"
  );

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<
    NotificationPermission
  > => {
    if (!isSupported) {
      console.warn("Notification API is not supported");
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      const permissionState = result as NotificationPermission;
      setPermission(permissionState);
      return permissionState;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }, [isSupported]);

  const show = useCallback(
    async (
      title: string,
      options?: NotificationOptions
    ): Promise<Notification | null> => {
      if (!isSupported) {
        console.warn("Notification API is not supported");
        return null;
      }

      if (permission !== "granted") {
        console.warn(
          "Notification permission not granted. Current permission:",
          permission
        );
        return null;
      }

      try {
        const notification = new Notification(title, options);
        return notification;
      } catch (error) {
        console.error("Error showing notification:", error);
        return null;
      }
    },
    [isSupported, permission]
  );

  return {
    show,
    permission,
    requestPermission,
    isSupported,
  };
}

export { useNotification };
export type {
  UseNotificationReturnValue,
  NotificationOptions,
  NotificationPermission,
};
