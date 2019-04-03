declare module "index" {
    function useInterval(callback: any, intervalDuration: any, startImmediate?: boolean): {
        start: () => void;
        stop: () => void;
        intervalId: null;
    };
    export default useInterval;
}
