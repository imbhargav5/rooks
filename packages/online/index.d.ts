declare module "index" {
    /**
     * useOnline hook
     *
     * Returns true if navigator is online, false if not.
     *
     * @returns {boolean} The value of navigator.onLine
     */
    function useOnline(): boolean;
    export default useOnline;
}
