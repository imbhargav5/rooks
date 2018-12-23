import { Ref } from "react";

export default function useMutationObserver(
  ref: Ref<HTMLElement>,
  callback: (
    mutationList: [MutationRecord],
    observer: MutationObserver
  ) => void,
  options?: MutationObserverInit
): void;
