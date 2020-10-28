interface UndoStateOptions {
    maxSize: number | undefined
}
  
export { UndoStateOptions }

export default function useUndoState(defaultValue: any, { maxSize }: UndoStateOptions): [any, Function, Function]
