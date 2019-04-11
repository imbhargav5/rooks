/// <reference types="node" />
declare module "index" {
    interface IntervalHandler {
        /**
         * Function to start the interval
         */
        start: () => void;
        /**
         * Function to stop the interval
         */
        stop: () => void;
        /**
         * IntervalId of the interval
         */
        intervalId: NodeJS.Timeout | null;
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
    function useInterval(callback: () => any, intervalDuration: number, startImmediate?: boolean): IntervalHandler;
    export default useInterval;
}
