interface UndoStateOptions {
    maxSize: number;
}
/**
 * Drop in replacement for useState hook but with undo functionality.
 *
 * @param {any} defaultValue
 * @param {UndoStateOptions} [{ maxSize }=defaultOptions]
 * @returns {[any, Function, Function]}
 */
declare const useUndoState: (defaultValue: any, options: UndoStateOptions) => [any, (prevState: any) => any, Function];
export { useUndoState };
