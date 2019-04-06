/// <reference types="react" />
declare module "index" {
    export default function useToggle(initialValue?: boolean, toggleFunction?: (state: any) => any): [any, import("react").Dispatch<{}>];
}
