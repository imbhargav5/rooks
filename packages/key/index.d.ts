import { Ref } from "react";

type Options = {
  when: boolean;
  eventTypes: [string];
  target: Ref<HTMLElement>;
};
export default function useKey(
  keyList: [string],
  handler: (a: KeyboardEvent) => void,
  opts: Options
): void;
