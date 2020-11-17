/**
 *
 * useRaf
 * @param {function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 */
export declare function useRaf(callback: (timeElapsed: number) => void, isActive: boolean): void;
