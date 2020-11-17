/**
 * Debounce hook
 * @param {function} callback The callback to debounce
 * @param {number} wait The duration to debounce
 * @returns {function} The debounced callback
 */
declare function useDebounce(callback: Function, wait: number, options: {}): Function;
export { useDebounce };
