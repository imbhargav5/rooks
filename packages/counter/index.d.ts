declare module "index" {
    interface CounterHandler {
        value: number;
        increment: () => void;
        decrement: () => void;
        incrementBy: (amount: number) => void;
        decrementBy: (amount: number) => void;
        reset: () => void;
    }
    /**
     *
     * @typedef handler
     * @type {Object}
     * @property {number} value The value of the counter
     * @property {function}  increment Increment counter value by 1
     * @property {function} decrement Decrement counter value by 1
     * @property {function} incrementBy Increment counter by incrAmount
     * @property {function} decrementBy Decrement counter by decrAmount
     * @property {function} reset Reset counter to initialValue
     */
    /**
     * Counter hook
     * @param {number} initialValue The initial value of the counter
     * @returns {handler} A handler to interact with the counter
     */
    function useCounter(initialValue: number): CounterHandler;
    export default useCounter;
}
