declare module "index" {
    export default function useToggle(initialValue?: boolean, toggleFunction?: (v: any) => boolean): (boolean | (() => void))[];
}
