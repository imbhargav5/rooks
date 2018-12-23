type TDate = Date | string | number;

type Options = {
  intervalMs: number;
  locale: string;
  relativeDate: TDate;
};

export default function useTimeAgo(timeValue: TDate, options: Options): string;
