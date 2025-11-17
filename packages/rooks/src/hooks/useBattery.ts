import { useState, useEffect } from "react";

/**
 * Battery manager interface
 */
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
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
 * Navigator interface with getBattery method
 */
interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

/**
 * Battery status information
 */
interface BatteryStatus {
  /**
   * Whether the battery is currently charging
   */
  charging: boolean;
  /**
   * Time in seconds until the battery is fully charged (Infinity if not charging)
   */
  chargingTime: number;
  /**
   * Time in seconds until the battery is fully discharged (Infinity if charging)
   */
  dischargingTime: number;
  /**
   * Battery level as a decimal between 0 and 1
   */
  level: number;
}

/**
 * Return value for the useBattery hook
 */
interface UseBatteryReturnValue extends BatteryStatus {
  /**
   * Whether the Battery Status API is supported
   */
  isSupported: boolean;
  /**
   * Whether battery information is currently loading
   */
  loading: boolean;
}

/**
 * useBattery hook
 *
 * Monitor device battery status including charge level, charging state, and time estimates.
 * Non-suspense version of battery status monitoring.
 *
 * @returns Object containing battery status information
 *
 * @example
 * ```tsx
 * import { useBattery } from "rooks";
 *
 * function BatteryStatus() {
 *   const { level, charging, chargingTime, dischargingTime, isSupported, loading } = useBattery();
 *
 *   if (!isSupported) {
 *     return <div>Battery Status API not supported</div>;
 *   }
 *
 *   if (loading) {
 *     return <div>Loading battery status...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Battery Status</h2>
 *       <p>Level: {(level * 100).toFixed(0)}%</p>
 *       <p>Status: {charging ? "Charging" : "Discharging"}</p>
 *       {charging && chargingTime !== Infinity && (
 *         <p>Time until charged: {Math.floor(chargingTime / 60)} minutes</p>
 *       )}
 *       {!charging && dischargingTime !== Infinity && (
 *         <p>Time until discharged: {Math.floor(dischargingTime / 60)} minutes</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useBattery
 */
function useBattery(): UseBatteryReturnValue {
  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "getBattery" in navigator;

  const [loading, setLoading] = useState(true);
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>({
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    level: 1,
  });

  useEffect(() => {
    if (!isSupported) {
      setLoading(false);
      return;
    }

    let battery: BatteryManager | null = null;

    const updateBatteryStatus = (batteryManager: BatteryManager) => {
      setBatteryStatus({
        charging: batteryManager.charging,
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime,
        level: batteryManager.level,
      });
    };

    const handleChange = () => {
      if (battery) {
        updateBatteryStatus(battery);
      }
    };

    (navigator as NavigatorWithBattery)
      .getBattery?.()
      .then((batteryManager) => {
        battery = batteryManager;
        updateBatteryStatus(batteryManager);
        setLoading(false);

        batteryManager.addEventListener("chargingchange", handleChange);
        batteryManager.addEventListener("chargingtimechange", handleChange);
        batteryManager.addEventListener("dischargingtimechange", handleChange);
        batteryManager.addEventListener("levelchange", handleChange);
      })
      .catch((error) => {
        console.error("Failed to get battery information:", error);
        setLoading(false);
      });

    return () => {
      if (battery) {
        battery.removeEventListener("chargingchange", handleChange);
        battery.removeEventListener("chargingtimechange", handleChange);
        battery.removeEventListener("dischargingtimechange", handleChange);
        battery.removeEventListener("levelchange", handleChange);
      }
    };
  }, [isSupported]);

  return {
    ...batteryStatus,
    isSupported,
    loading,
  };
}

export { useBattery };
export type { UseBatteryReturnValue, BatteryStatus };
