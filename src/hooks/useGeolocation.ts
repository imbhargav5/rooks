import { useEffect, useState } from 'react';

type IGetGeoLocation = {
  lat?: number;
  lng?: number;
  isError: boolean;
  message: string;
};

type IOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  when?: boolean;
};

function getGeoLocation(options: IOptions): Promise<IGetGeoLocation> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (res) => {
          const { coords } = res;
          const { latitude, longitude } = coords;
          resolve({
            isError: false,
            lat: latitude,
            lng: longitude,
            message: '',
          });
        },
        (error) => {
          reject({ isError: true, message: error.message });
        },
        options
      );
    } else {
      reject({
        isError: true,
        message: 'Geolocation is not supported for this Browser/OS.',
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
      getGeoCode();
    }
  }, [when, enableHighAccuracy, timeout, maximumAge]);

  return geoObject;
}

export { useGeolocation };
