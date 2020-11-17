declare type EventCallback = (this: Document, ev: any) => any;
declare type FullscreenApi = {
    isEnabled: boolean;
    toggle: (element?: HTMLElement) => Promise<unknown>;
    onChange: (callback: EventCallback) => void;
    onError: (callback: EventCallback) => void;
    request: (element?: HTMLElement) => Promise<unknown>;
    exit: () => Promise<unknown>;
    isFullscreen: boolean;
    element: HTMLElement;
};
export declare const useFullscreen: () => FullscreenApi;
export {};
