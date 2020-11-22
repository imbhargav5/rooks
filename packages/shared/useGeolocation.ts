import { useEffect, useState } from "react";

interface IGetGeoLocation {
  lat?: number;
  lng?: number;
  isError: boolean;
  message: string;
}

interface IOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  when?: boolean;
}

function getGeoLocation(options: IOptions): Promise<IGetGeoLocation> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        res => {
          const { coords } = res;
          const { latitude, longitude } = coords;
          resolve({
            lat: latitude,
            lng: longitude,
            isError: false,
            message: ""
          });
        },
        err => {
          reject({ message: err.message, isError: true });
        },
        options
      );
    } else {
      reject({
        isError: true,
        message: "Geolocation is not supported for this Browser/OS."
      });
    }
  });
}

// interface IUseGeoLocationHook {
//   when?: boolean;
// }

// const defaultHookOptions = {
//   when: true
// };

const defaultGeoLocationOptions = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
  when: true
};

/**
 * useGeolocation
 * Gets the geolocation data as a hook
 * @param geoLocationOptions Geolocation options
 */
function useGeolocation(
  // hooksOptions: IUseGeoLocationHook = defaultHookOptions,
  geoLocationOptions: IOptions = defaultGeoLocationOptions
): IGetGeoLocation | null {
  const [geoObj, setGeoObj] = useState<IGetGeoLocation|null>(null);
  const { when, enableHighAccuracy, timeout, maximumAge } = geoLocationOptions;

  useEffect(() => {
    async function getGeoCode() {
      try {
        const value = await getGeoLocation({
          when,
          enableHighAccuracy,
          timeout,
          maximumAge
        });
        setGeoObj(value);
      } catch (e) {
        setGeoObj(e);
      }
    }
    if (when) {
      getGeoCode();
    }
  }, [when, enableHighAccuracy, timeout, maximumAge]);

  return geoObj;
}

export { useGeolocation };
