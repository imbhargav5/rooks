import { useState, useEffect } from "react";

/**
 * Network connection types
 */
type ConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "none"
  | "wifi"
  | "wimax"
  | "other"
  | "unknown";

/**
 * Effective connection types
 */
type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

/**
 * Network connection interface
 */
interface NetworkInformation extends EventTarget {
  type?: ConnectionType;
  effectiveType?: EffectiveConnectionType;
  downlink?: number;
  downlinkMax?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}

/**
 * Navigator interface with connection property
 */
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/**
 * Network information data
 */
interface NetworkInfo {
  /**
   * Network connection type (wifi, cellular, etc.)
   */
  type: ConnectionType | null;
  /**
   * Effective connection type (4g, 3g, 2g, slow-2g)
   */
  effectiveType: EffectiveConnectionType | null;
  /**
   * Downlink speed in Mbps
   */
  downlink: number | null;
  /**
   * Maximum downlink speed in Mbps
   */
  downlinkMax: number | null;
  /**
   * Round trip time in milliseconds
   */
  rtt: number | null;
  /**
   * Whether data saver mode is enabled
   */
  saveData: boolean;
}

/**
 * Return value for the useNetworkInformation hook
 */
interface UseNetworkInformationReturnValue extends NetworkInfo {
  /**
   * Whether the Network Information API is supported
   */
  isSupported: boolean;
}

/**
 * useNetworkInformation hook
 *
 * Network connection quality and type detection using the Network Information API.
 * Provides information about the user's connection including speed, type, and data saver mode.
 *
 * @returns Object containing network information
 *
 * @example
 * ```tsx
 * import { useNetworkInformation } from "rooks";
 *
 * function NetworkStatus() {
 *   const { effectiveType, downlink, rtt, saveData, isSupported } = useNetworkInformation();
 *
 *   if (!isSupported) {
 *     return <div>Network Information API not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Network Status</h2>
 *       <p>Connection Type: {effectiveType}</p>
 *       {downlink && <p>Download Speed: {downlink} Mbps</p>}
 *       {rtt && <p>Round Trip Time: {rtt} ms</p>}
 *       {saveData && <p>Data Saver Mode: Enabled</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useNetworkInformation
 */
function useNetworkInformation(): UseNetworkInformationReturnValue {
  const getConnection = (): NetworkInformation | null => {
    if (typeof navigator === "undefined") {
      return null;
    }

    const nav = navigator as NavigatorWithConnection;
    return nav.connection || nav.mozConnection || nav.webkitConnection || null;
  };

  const isSupported = getConnection() !== null;

  const getNetworkInfo = (): NetworkInfo => {
    const connection = getConnection();

    if (!connection) {
      return {
        type: null,
        effectiveType: null,
        downlink: null,
        downlinkMax: null,
        rtt: null,
        saveData: false,
      };
    }

    return {
      type: connection.type || null,
      effectiveType: connection.effectiveType || null,
      downlink: connection.downlink ?? null,
      downlinkMax: connection.downlinkMax ?? null,
      rtt: connection.rtt ?? null,
      saveData: connection.saveData ?? false,
    };
  };

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(getNetworkInfo());

  useEffect(() => {
    const connection = getConnection();

    if (!connection) {
      return;
    }

    const handleChange = () => {
      setNetworkInfo(getNetworkInfo());
    };

    connection.addEventListener("change", handleChange);

    return () => {
      connection.removeEventListener("change", handleChange);
    };
  }, []);

  return {
    ...networkInfo,
    isSupported,
  };
}

export { useNetworkInformation };
export type {
  UseNetworkInformationReturnValue,
  NetworkInfo,
  ConnectionType,
  EffectiveConnectionType,
};
