declare type CountdownOptions = {
    interval?: number;
    onDown?: Function;
    onEnd?: Function;
};
declare const useCountdown: (endTime: Date, { interval, onDown, onEnd }?: CountdownOptions) => number;
export { useCountdown };
