interface StorageHandlerAsArray extends Array<any> {
    0: any;
    1: (newValue: any) => void;
    2: () => void;
}
interface StorageHandler extends StorageHandlerAsArray {
}
/**
 * useLocalstorage hook
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} defaultValue - Default initial value
 */
declare function useLocalstorage(key: string, defaultValue?: any): StorageHandler;
export { useLocalstorage };
