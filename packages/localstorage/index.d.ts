declare module "index" {
    function useLocalStorage(key: any, defaultValue?: null): {
        value: any;
        set: (newValue: any) => void;
        remove: () => false | undefined;
    };
    export default useLocalStorage;
}
