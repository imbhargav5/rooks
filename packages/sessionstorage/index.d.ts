declare module "index" {
    function useSessionStorage(key: string, defaultValue?: null): {
        value: any;
        set: (newValue: string | null) => void;
        remove: () => null | undefined;
    };
    export default useSessionStorage;
}
