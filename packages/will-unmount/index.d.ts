declare module "index" {
    /**
     *
     * useWillUnmount hook
     *
     * Fires a callback just before component unmounts
     *
     * @param {function} callback Callback to be called before unmount
     */
    function useWillUnmount(callback: () => any): void;
    export default useWillUnmount;
}
