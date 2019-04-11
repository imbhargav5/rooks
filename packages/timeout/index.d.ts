declare module "index" {
    interface UseTimeoutHandler {
        start: () => any;
        clear: () => any;
        isActive: boolean;
    }
    function useTimeout(cb: () => void, timeoutDelayMs?: number): UseTimeoutHandler;
    export default useTimeout;
}
