/// <reference types="react" />
declare module "index" {
    type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
    interface InputHandler {
        /**
         * The current value of the input
         */
        value: string;
        /**
         * Function to handle onChange of an input element
         * @param event The input change event
         */
        onChange: (e: InputChangeEvent) => void;
    }
    interface Options {
        /**
         * validate
         *
         * Validator function which can be used to prevent updates
         *
         * @param {string} New value
         * @param {string} Current value
         * @return {boolean} Whether an update should happen or not
         *
         * */
        validate?: (newValue: string, currentValue: string) => boolean;
    }
    /**
     *
     * useInput Hook
     *
     * Handles an input's value and onChange props internally to
     * make text input creation process easier
     *
     * @param {string} [initialValue=""] Initial value of the input
     * @param {Options} [opts={}] Options object
     * @returns {InputHandler} Input handler with value and onChange
     */
    function useInput(initialValue?: string, opts?: Options): InputHandler;
    export default useInput;
}
