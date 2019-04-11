declare module "index" {
    /**
     *  useDidUpdate hook
     *
     *  Fires a callback on component update
     *  Can take in a list of conditions to fire callback when one of the
     *  conditions changes
     *
     * @param {function} callback The callback to be called on update
     * @param {Array} conditions The list of variables which trigger update when they are changed
     * @return {undefined}
     */
    function useDidUpdate(callback: () => any, conditions?: Array<any>): void;
    export default useDidUpdate;
}
