declare module "index" {
    /**
     * Online hook
     * @returns {boolean} The value of navigator.onLine
     */
    function useOnline(): boolean | undefined;
    export default useOnline;
}
