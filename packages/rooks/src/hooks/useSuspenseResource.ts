import { Dispatch, SetStateAction, useState } from "react";

export const createSuspenseResource = <T>(
  promise: Promise<T>
): SuspenseResource<T> => {
  let status = "init";
  let result: T | Error;
  const suspender = promise.then(
    (data) => {
      status = "success";
      result = data;
    },
    (caughtError: Error) => {
      result = caughtError;
      status = "error";
    }
  );
  return {
    read: (): T => {
      if (status === "init") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else {
        return result as T;
      }
    },
  };
};

type SuspenseResource<T> = {
  read: () => T;
};
/**
 * useSuspenseResource
 * @description A suspense resource hook that manages a resource and will suspend while it is fetched.
 * @see {@link https://react-hooks.org/docs/useSuspenseResource}
 * @example
 *
 * const [geolocationResource, setResource] = useSuspenseResource(async () => {
 *  const { data } = await axios.get('https://ipapi.co/json/');
 *  return data;
 * });
 *
 * <Suspense fallback={<Loading />}>
 *   <RenderGeolocation geolocationResource={geolocationResource} setResource={setResource} />
 * </Suspense>
 *
 * function RenderGeolocation({ geolocationResource, setResource }) {
 *  const geolocation = useMemo(() => {
 *   return geolocationResource.read();
 *  }, [geolocationResource]);
 *  return <div>{geolocation.ip}</div>;
 * };
 */
function useSuspenseResource<T>(
  promise: Promise<T>
): [SuspenseResource<T>, Dispatch<SetStateAction<SuspenseResource<T>>>] {
  return useState<SuspenseResource<T>>(() => createSuspenseResource(promise));
}

export { useSuspenseResource };
