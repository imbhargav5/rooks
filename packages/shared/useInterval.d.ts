/// <reference types="node" />
interface IntervalHandlerAsArray extends Array<null | NodeJS.Timeout | (() => void)> {
    0: () => void;
    1: () => void;
    2: NodeJS.Timeout | null;
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
declare function useInterval(callback: () => any, intervalDuration: number, startImmediate?: boolean): IntervalHandler;
export { useInterval };
