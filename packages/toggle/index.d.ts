declare module "index" {
    export default function useToggle(initialValue?: boolean, toggleFunction?: (state: any, action: any) => any): [any, (action: any) => any];
}
