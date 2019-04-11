declare module "index" {
    interface Options {
        intervalMs: number;
        locale: string;
        relativeDate: any;
    }
    function useTimeAgo(input: any, argOpts: Options): string;
    export default useTimeAgo;
}
