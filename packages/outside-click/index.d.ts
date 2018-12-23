import { Ref } from "react";
export default function useOutsideClick(
  ref: Ref<HTMLElement>,
  callback: (event: Event) => void,
  when: boolean
): void;
