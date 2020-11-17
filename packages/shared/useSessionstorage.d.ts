interface StorageHandlerAsArray extends Array<any> {
    0: any;
    1: (newValue: any) => void;
    2: () => void;
}
interface StorageHandler extends StorageHandlerAsArray {
}
declare function useSessionstorage(key: string, defaultValue?: null): StorageHandler;
export { useSessionstorage };
