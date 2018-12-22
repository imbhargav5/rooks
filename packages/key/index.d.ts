type Options = {
  when: boolean;
  eventTypes: [string];
};
export default function useKey(
  keyList: [string],
  handler: (a: KeyboardEvent) => void,
  opts: Options
): void;
