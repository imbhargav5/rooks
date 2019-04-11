declare module "index" {
    /**
     *
     * usePrevious hook for React
     *
     * @param {*} currentValue The value whose previous value is to be tracked
     * @returns {*} The previous value
     */
    function usePrevious<T>(currentValue: T): T | null;
    export default usePrevious;
}
