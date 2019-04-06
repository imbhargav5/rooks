declare module "index" {
    function useTimeout(cb: any, timeoutDelayMs?: number): {
        clear: () => void;
        start: () => void;
    };
    export default useTimeout;
}
