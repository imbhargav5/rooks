declare module "online/src/index" {
    /**
     * Online hook
     * @returns {boolean} The value of navigator.onLine
     */
    function useOnline(): boolean | undefined;
    export default useOnline;
}
declare module "rooks/index" {
    import useOnline from "online/src/index";
    export { useOnline };
}
