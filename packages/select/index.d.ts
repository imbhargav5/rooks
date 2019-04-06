/// <reference types="react" />
declare module "index" {
    /**
     *
     * @typedef handler
     * @type {Object}
     * @property {number} index The index of the selected item in the list
     * @property {function}  item The selected item in the list
     * @property {function} setIndex Set value at index
     * @property {function} setItem Set value
     */
    /**
     *
     *
     * @param {Array} list List of values to select a value from
     * @param {number} [initialIndex=0] Initial index which is selected
     * @returns {handler}
     */
    function useSelect(list: any, initialIndex?: number): {
        index: number;
        item: any;
        setIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
        setItem: (item: any) => void;
    };
    export default useSelect;
}
