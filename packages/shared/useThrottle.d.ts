declare function useThrottle(fn: Function, timeout?: number): (boolean | ((...args: any[]) => void))[];
export { useThrottle };
