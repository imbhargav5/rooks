import { useEffect, useState } from "react";

type UseGeolocationOptions = Partial<
  PositionOptions & {
    // Is the geolocation hook enabled
    when: boolean;
  }
>;

type UseGeolocationReturntype = [GeolocationPosition | null, Error | null];

const getGeoLocation = (
  controller: AbortController,
  options: PositionOptions
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const handleAbort = () => {
        reject(new Error("Aborted"));
      };
      navigator.geolocation.getCurrentPosition(
        (result: GeolocationPosition) => {
          controller.signal.removeEventListener("abort", handleAbort);
          resolve(result);
        },
        (error) => {
          controller.signal.removeEventListener("abort", handleAbort);
          reject(error);
        },
        options
      );
      controller.signal.addEventListener("abort", handleAbort);
    } else {
      reject(new Error("Geolocation is not supported for this Browser/OS."));
    }
  });
};

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
  hookOptions?: UseGeolocationOptions
): UseGeolocationReturntype {
  const options = Object.assign({}, defaultGeoLocationOptions, hookOptions);

  // store the geolocation options
  const [geoObject, setGeoObject] = useState<GeolocationPosition | null>(null);
  // store the error option
  const [geoObjectError, setGeoObjectError] = useState<Error | null>(null);

  const { when, ...otherGeolocationOptions } = options;

  useEffect(() => {
    const fetchGeoloation = async (controller: AbortController) => {
      try {
        const value = await getGeoLocation(controller, otherGeolocationOptions);
        setGeoObject(value);
      } catch (error) {
        setGeoObject(null);
        setGeoObjectError(error);
      }

      return () => {
        controller.abort();
      };
    };
    if (when) {
      const controller = new AbortController();
      void fetchGeoloation(controller);

      return () => {
        controller.abort();
      };
    }

    return () => {};
  }, [when, otherGeolocationOptions]);

  return [geoObject, geoObjectError];
}

export { useGeolocation };
