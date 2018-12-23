type Options = {
  onMessage?: (e: Event) => void;
  onMessageError?: (e: Event) => void;
};
export default function useWorker(aURL: string, options?: Options): Worker;
