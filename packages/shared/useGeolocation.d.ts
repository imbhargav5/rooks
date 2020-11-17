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
declare function useGeolocation(geoLocationOptions?: IOptions): IGetGeoLocation | null;
export { useGeolocation };
