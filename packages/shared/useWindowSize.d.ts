interface WindowDimensions {
    innerWidth: number | null;
    innerHeight: number | null;
    outerWidth: number | null;
    outerHeight: number | null;
}
/**
 * useWindowSize
 *
 * A hook that provides information of the dimensions of the window
 *
 * @return {WindowDimensions}  Dimensions of the window
 */
export declare function useWindowSize(): WindowDimensions;
export {};
