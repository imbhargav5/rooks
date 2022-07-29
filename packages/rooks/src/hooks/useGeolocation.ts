import { useEffect, useState } from "react";

type IGetGeoLocation = {
  isError: boolean;
  lat?: number;
  lng?: number;
  message: string;
};

type IOptions = {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  when?: boolean;
};

function getGeoLocation(options: IOptions): Promise<IGetGeoLocation> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { coords } = position;
          const { latitude, longitude } = coords;
          resolve({
            isError: false,
            lat: latitude,
            lng: longitude,
            message: "",
          });
        },
        (error) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ isError: true, message: error.message });
        },
        options
      );
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        isError: true,
        message: "Geolocation is not supported for this Browser/OS.",
      });
    }
  });
}

const defaultGeoLocationOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: Number.POSITIVE_INFINITY,
  when: true,
};

/**
 * useGeolocation
 * Gets the geolocation data as a hook
 *
 * @param geoLocationOptions Geolocation options
 */
function useGeolocation(
  // hooksOptions: IUseGeoLocationHook = defaultHookOptions,
  geoLocationOptions: IOptions = defaultGeoLocationOptions
): IGetGeoLocation | null {
  const [geoObject, setGeoObject] = useState<IGetGeoLocation | null>(null);
  const { when, enableHighAccuracy, timeout, maximumAge } = geoLocationOptions;

  useEffect(() => {
    async function getGeoCode() {
      try {
        const value = await getGeoLocation({
          enableHighAccuracy,
          maximumAge,
          timeout,
          when,
        });
        setGeoObject(value);
      } catch (error) {
        setGeoObject(error);
      }
    }

    if (when) {
      void getGeoCode();
    }
  }, [when, enableHighAccuracy, timeout, maximumAge]);

  return geoObject;
}

export { useGeolocation };
