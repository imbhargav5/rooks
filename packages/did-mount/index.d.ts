declare module "index" {
    /**
     *
     * @param {function} callback Callback function to be called on mount
     */
    function useDidMount(callback: () => any): void;
    export default useDidMount;
}
