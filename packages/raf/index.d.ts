declare module "index" {
    /**
     *
     * useRaf
     * @param {function} callback The callback function to be executed
     * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
     */
    export default function useRaf(callback: (timeElapsed: number) => void, isActive: boolean): void;
}
