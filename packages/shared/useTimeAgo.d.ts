interface Options {
    intervalMs: number;
    locale: string;
    relativeDate: any;
}
declare function useTimeAgo(input: any, argOpts: Options): string;
export { useTimeAgo };
