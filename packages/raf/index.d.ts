declare module "index" {
    /**
     *
     * useRaf
     * @param {function} callback The callback function to be executed
     * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
     * @returns {number} The raf id
     */
    function useRaf(callback: any, isActive?: boolean): null;
    export default useRaf;
}
