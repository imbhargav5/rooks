interface UseTimeoutHandler {
    start: () => any;
    clear: () => any;
    stop: () => any;
    isActive: boolean;
}
declare function useTimeout(cb: () => void, timeoutDelayMs?: number): UseTimeoutHandler;
export { useTimeout };
