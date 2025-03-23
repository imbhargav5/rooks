import { useCallback, useEffect, useState } from "react";

export type ConnectionType = "bluetooth" | "cellular" | "ethernet" | "mixed" | "none" | "other" | "unknown" | "wifi" | "wimax";
export type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

export type NetworkInformation = {
    downlink?: number;
    effectiveType?: EffectiveConnectionType;
    rtt?: number;
    saveData?: boolean;
    type?: ConnectionType;
};

export type NetworkInformationHandler = {
    isOnline: boolean;
    networkInformation: NetworkInformation;
    effectiveType?: EffectiveConnectionType;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: ConnectionType;
};

/**
 * useNetworkInformation
 * @description A hook to monitor network status and changes
 * @returns {NetworkInformationHandler} Network status and connection information
 * @see {@link https://rooks.vercel.app/docs/useNetworkInformation}
 *
 * @example
 *
 * const { 
 *   isOnline, 
 *   effectiveType, 
 *   downlink, 
 *   rtt, 
 *   saveData 
 * } = useNetworkInformation();
 *
 * // Check if user is online
 * if (!isOnline) {
 *   showOfflineMessage();
 * }
 *
 * // Adapt experience based on connection quality
 * if (effectiveType === '4g') {
 *   loadHighQualityAssets();
 * } else {
 *   loadLowQualityAssets();
 * }
 */
function useNetworkInformation(): NetworkInformationHandler {
    const [isOnline, setIsOnline] = useState<boolean>(
        typeof navigator !== "undefined" ? navigator.onLine : true
    );

    const [networkInformation, setNetworkInformation] = useState<NetworkInformation>({});

    // Function to get network information from the connection API if available
    const getNetworkInformation = useCallback((): NetworkInformation => {
        if (typeof navigator === "undefined") {
            return {};
        }

        // Use type assertion to handle vendor-prefixed properties
        const nav = navigator as any;
        const connection = nav.connection ||
            nav.mozConnection ||
            nav.webkitConnection ||
            null;

        if (!connection) {
            return {};
        }

        return {
            downlink: connection.downlink,
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            saveData: connection.saveData,
            type: connection.type
        };
    }, []);

    // Update network info
    const updateNetworkInformation = useCallback(() => {
        setNetworkInformation(getNetworkInformation());
    }, [getNetworkInformation]);

    // Event handlers for online/offline status
    const handleOnline = useCallback(() => {
        setIsOnline(true);
        updateNetworkInformation();
    }, [updateNetworkInformation]);

    const handleOffline = useCallback(() => {
        setIsOnline(false);
        updateNetworkInformation();
    }, [updateNetworkInformation]);

    // Connection change event handler
    const handleConnectionChange = useCallback(() => {
        updateNetworkInformation();
    }, [updateNetworkInformation]);

    // Set up event listeners
    useEffect(() => {
        // Initial network information
        updateNetworkInformation();

        // Add event listeners for online/offline status
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Add connection change event listener if supported
        const nav = navigator as any;
        const connection = nav.connection ||
            nav.mozConnection ||
            nav.webkitConnection ||
            null;

        if (connection) {
            connection.addEventListener("change", handleConnectionChange);
        }

        // Clean up event listeners
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);

            if (connection) {
                connection.removeEventListener("change", handleConnectionChange);
            }
        };
    }, [handleOnline, handleOffline, handleConnectionChange, updateNetworkInformation]);

    return {
        isOnline,
        networkInformation,
        effectiveType: networkInformation.effectiveType,
        downlink: networkInformation.downlink,
        rtt: networkInformation.rtt,
        saveData: networkInformation.saveData,
        type: networkInformation.type
    };
}

export { useNetworkInformation }; 