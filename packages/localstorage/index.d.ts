declare module "index" {
    interface LocalStorageHandler {
        value: string | null;
        set: (newValue: string) => void;
        remove: () => void;
    }
    /**
     * useLocalStorage hook
     *
     * @param {string} key - Key of the localStorage object
     * @param {string} defaultValue - Default initial value
     */
    function useLocalStorage(key: string, defaultValue?: any): LocalStorageHandler;
    export default useLocalStorage;
}
