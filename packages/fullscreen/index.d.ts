type EventCallback = (this: Document, ev: any) => any;

interface FullscreenApi {
  readonly isEnabled: boolean;
  readonly toggle: (element?: HTMLElement) => Promise<unknown>;
  readonly onChange: (callback: EventCallback) => void;
  readonly onError: (callback: EventCallback) => void;
  readonly request: (element?: HTMLElement) => Promise<unknown>;
  readonly exit: () => Promise<unknown>;
  readonly isFullscreen: boolean;
  readonly element: HTMLElement | null;
}

export default function useFullscreen(): FullscreenApi;
