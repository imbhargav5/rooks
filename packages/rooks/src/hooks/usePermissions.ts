import { useCallback, useEffect, useState } from "react";

export type PermissionName =
    | "geolocation"
    | "notifications"
    | "push"
    | "midi"
    | "camera"
    | "microphone"
    | "speaker"
    | "device-info"
    | "background-fetch"
    | "background-sync"
    | "bluetooth"
    | "persistent-storage"
    | "ambient-light-sensor"
    | "accelerometer"
    | "gyroscope"
    | "magnetometer"
    | "clipboard-read"
    | "clipboard-write"
    | "display-capture"
    | "nfc";

export type PermissionState = "granted" | "denied" | "prompt";

export type PermissionStatus = {
    name: PermissionName;
    state: PermissionState;
};

export type PermissionsHandler = {
    status: Record<PermissionName, PermissionState>;
    request: (permissions?: PermissionName[]) => Promise<Record<PermissionName, PermissionState>>;
    check: (permission: PermissionName) => Promise<PermissionState>;
    isGranted: (permission: PermissionName) => boolean;
    isDenied: (permission: PermissionName) => boolean;
    isPrompt: (permission: PermissionName) => boolean;
    error: Error | null;
};

/**
 * usePermissions
 * @description A hook to request and track browser permissions
 * @param {PermissionName[]} permissionNames Array of permission names to track
 * @returns {PermissionsHandler} Methods and state for permission management
 * @see {@link https://rooks.vercel.app/docs/usePermissions}
 *
 * @example
 *
 * const { 
 *   status, 
 *   request, 
 *   check, 
 *   isGranted, 
 *   isDenied, 
 *   isPrompt 
 * } = usePermissions(["camera", "microphone"]);
 *
 * // Request permissions
 * request().then(() => {
 *   if (isGranted("camera")) {
 *     // Camera permission granted
 *   }
 * });
 */
function usePermissions(permissionNames: PermissionName[] = []): PermissionsHandler {
    const [status, setStatus] = useState<Record<PermissionName, PermissionState>>({} as Record<PermissionName, PermissionState>);
    const [error, setError] = useState<Error | null>(null);

    const checkPermission = useCallback(async (name: PermissionName): Promise<PermissionState> => {
        if (!("permissions" in navigator)) {
            setError(new Error("Permissions API is not supported in this browser"));
            return "denied";
        }

        try {
            const result = await navigator.permissions.query({ name: name as any });
            return result.state as PermissionState;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return "denied";
        }
    }, []);

    const updatePermissionStatus = useCallback(async (names: PermissionName[]) => {
        const newStatus: Record<PermissionName, PermissionState> = { ...status };

        for (const name of names) {
            try {
                newStatus[name] = await checkPermission(name);
            } catch (err) {
                // If an error occurs for a specific permission, continue with others
                newStatus[name] = "denied";
            }
        }

        setStatus(newStatus);
    }, [status, checkPermission]);

    const check = useCallback(async (permission: PermissionName): Promise<PermissionState> => {
        const state = await checkPermission(permission);
        setStatus((prev) => ({ ...prev, [permission]: state }));
        return state;
    }, [checkPermission]);

    const request = useCallback(async (permissions: PermissionName[] = permissionNames): Promise<Record<PermissionName, PermissionState>> => {
        if (!permissions.length) {
            return status;
        }

        const newStatus: Record<PermissionName, PermissionState> = { ...status };

        // For some permissions, we need to request them via their specific APIs
        for (const name of permissions) {
            try {
                switch (name) {
                    case "geolocation":
                        await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        newStatus[name] = "granted";
                        break;

                    case "notifications":
                        const notificationPermission = await Notification.requestPermission();
                        newStatus[name] = notificationPermission as PermissionState;
                        break;

                    case "camera":
                    case "microphone":
                        const constraints: MediaStreamConstraints = {
                            video: name === "camera",
                            audio: name === "microphone"
                        };
                        const stream = await navigator.mediaDevices.getUserMedia(constraints);
                        // Stop all tracks to release the devices
                        stream.getTracks().forEach(track => track.stop());
                        newStatus[name] = "granted";
                        break;

                    case "clipboard-read":
                        try {
                            await navigator.clipboard.readText();
                            newStatus[name] = "granted";
                        } catch (error) {
                            // Check if it's a permission error
                            const state = await checkPermission(name);
                            newStatus[name] = state;
                        }
                        break;

                    case "clipboard-write":
                        try {
                            await navigator.clipboard.writeText("");
                            newStatus[name] = "granted";
                        } catch (error) {
                            // Check if it's a permission error
                            const state = await checkPermission(name);
                            newStatus[name] = state;
                        }
                        break;

                    default:
                        // For other permissions, we check their status with the Permissions API
                        newStatus[name] = await checkPermission(name);
                        break;
                }
            } catch (err) {
                // If requesting a specific permission fails, mark it as denied
                newStatus[name] = "denied";
            }
        }

        setStatus(newStatus);
        return newStatus;
    }, [permissionNames, status, checkPermission]);

    const isGranted = useCallback((permission: PermissionName): boolean => {
        return status[permission] === "granted";
    }, [status]);

    const isDenied = useCallback((permission: PermissionName): boolean => {
        return status[permission] === "denied";
    }, [status]);

    const isPrompt = useCallback((permission: PermissionName): boolean => {
        return status[permission] === "prompt";
    }, [status]);

    // Initialize permission status when the component mounts
    useEffect(() => {
        if (permissionNames.length > 0) {
            updatePermissionStatus(permissionNames);
        }
    }, [permissionNames, updatePermissionStatus]);

    return {
        status,
        request,
        check,
        isGranted,
        isDenied,
        isPrompt,
        error
    };
}

export { usePermissions }; 