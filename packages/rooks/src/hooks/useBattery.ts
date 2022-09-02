import { useEffect, useState } from "react";
const isNavigatorPresent = typeof navigator !== "undefined";
export interface BatteryState {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}
function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]>
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement["addEventListener"]>)
    );
  }
}
export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["removeEventListener"]>
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement["removeEventListener"]>)
    );
  }
}

interface BatteryManager extends Readonly<BatteryState>, EventTarget {
  onchargingchange: () => void;
  onchargingtimechange: () => void;
  ondischargingtimechange: () => void;
  onlevelchange: () => void;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  charging: boolean;
}

interface NavigatorWithPossibleBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

type UseBatteryState =
  | { isSupported: false } // Battery API is not supported
  | { isSupported: true; fetched: false } // battery API supported but not fetched yet
  | (BatteryState & { isSupported: true; fetched: true }); // battery API supported and fetched

const nav: NavigatorWithPossibleBattery | undefined = isNavigatorPresent
  ? navigator
  : undefined;
const isBatteryApiSupported = nav && typeof nav.getBattery === "function";

/**
 *
 * useBattery hook
 *
 * A hook that utilizes the getBattery() method on naviagator
 *  to get the battery information of device
 */

function useBattery(): UseBatteryState {
  const [batteryState, setBatteryState] = useState<UseBatteryState>({
    isSupported: true,
    fetched: false,
  });

  useEffect(() => {
    // check if batter api is supported on the browser
    if (isBatteryApiSupported) {
      let isMounted = true;
      let battery: BatteryManager | null = null;

      const handleChange = () => {
        if (!isMounted || !battery) {
          return;
        }
        const newState: UseBatteryState = {
          isSupported: true,
          fetched: true,
          level: battery.level,
          charging: battery.charging,
          dischargingTime: battery.dischargingTime,
          chargingTime: battery.chargingTime,
        };
        setBatteryState(newState);
      };

      nav!.getBattery!().then((batteryManager: BatteryManager) => {
        if (!isMounted) {
          return;
        }
        battery = batteryManager;
        on(battery, "chargingchange", handleChange);
        on(battery, "chargingtimechange", handleChange);
        on(battery, "dischargingtimechange", handleChange);
        on(battery, "levelchange", handleChange);
        handleChange();
      });

      return () => {
        isMounted = false;
        if (battery) {
          off(battery, "chargingchange", handleChange);
          off(battery, "chargingtimechange", handleChange);
          off(battery, "dischargingtimechange", handleChange);
          off(battery, "levelchange", handleChange);
        }
      };
    } else {
      setBatteryState({ isSupported: false });
      return;
    }
  }, []);

  return batteryState;
}
export { useBattery };
