interface IntervalHandlerAsArray extends Array<null | ReturnType<typeof setTimeout> | (() => void)> {
    0: () => void;
    1: () => void;
    2: ReturnType<typeof setTimeout> | null;
}
interface IntervalHandler extends IntervalHandlerAsArray {
}
/**
 *
 * useInterval hook
 *
 * Declaratively creates a setInterval to run a callback after a fixed
 * amount of time
 *
 *@param {funnction} callback - Callback to be fired
 *@param {number} intervalId - Interval duration in milliseconds after which the callback is to be fired
 *@param {boolean} startImmediate - Whether the interval should start immediately on initialise
 *@return {IntervalHandler}
 */
declare function useInterval(callback: () => any, intervalDuration: number | null, startImmediate?: boolean): IntervalHandler;
export { useInterval };
