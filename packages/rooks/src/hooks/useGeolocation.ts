import { UseGeolocationReturnType } from "../types/types";
import { useEffect, useState } from "react";
import { useGetIsMounted } from "./useGetIsMounted";

type UseGeoLocationOptions = PositionOptions & {
  when?: boolean;
};

function getGeoLocation(
  options: UseGeoLocationOptions
): Promise<UseGeolocationReturnType> {
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

const defaultGeoLocationOptions: UseGeoLocationOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: Number.POSITIVE_INFINITY,
  when: true,
};

/**
 * useGeolocation
 * Gets the geolocation data as a hook
 *
 * @param {UseGeoLocationOptions} geoLocationOptions Geolocation options
 * @see {https://react-hooks.org/docs/useGeolocation}
 */
function useGeolocation(
  geoLocationOptions: UseGeoLocationOptions = defaultGeoLocationOptions
): UseGeolocationReturnType | null {
  const [geoObject, setGeoObject] = useState<UseGeolocationReturnType | null>(
    null
  );
  const { when, enableHighAccuracy, timeout, maximumAge } = geoLocationOptions;
  const getIsMounted = useGetIsMounted();
  useEffect(() => {
    async function getGeoCode() {
      try {
        const value = await getGeoLocation({
          enableHighAccuracy,
          maximumAge,
          timeout,
          when,
        });
        if (getIsMounted()) {
          setGeoObject(value);
        }
      } catch (error) {
        if (getIsMounted()) {
          setGeoObject(error);
        }
      }
    }
    if (when) {
      void getGeoCode();
    }
  }, [when, enableHighAccuracy, timeout, maximumAge, getIsMounted]);

  return geoObject;
}

export { useGeolocation };
