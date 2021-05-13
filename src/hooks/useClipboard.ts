import * as React from 'react';

type Clipboard = {
  readText: () => Promise<string>;
  writeText: (text: string) => Promise<void>;
};

type ClipboardDataWindow = Window & {
  clipboardData: DataTransfer | null;
};

type ClipboardEventListener =
  | EventListenerObject
  | ((event: ClipboardEvent) => void)
  | null;

type ClipboardEventTarget = EventTarget & {
  addEventListener: ((
    type: 'copy',
    eventListener: ClipboardEventListener
  ) => void) &
    ((type: 'cut', eventListener: ClipboardEventListener) => void) &
    ((type: 'paste', eventListener: ClipboardEventListener) => void);
  removeEventListener: ((
    type: 'copy',
    eventListener: ClipboardEventListener
  ) => void) &
    ((type: 'cut', eventListener: ClipboardEventListener) => void) &
    ((type: 'paste', eventListener: ClipboardEventListener) => void);
};

type ClipboardNavigator = Navigator & {
  clipboard: Clipboard & ClipboardEventTarget;
};

type ClipboardTuple = [string, (clipboard: string) => void];

type VoidFunction = () => void;

const hasClipboardData = (window: Window): window is ClipboardDataWindow =>
  Object.prototype.hasOwnProperty.call(window, 'clipboardData');

const getClipboardData = (
  window: ClipboardDataWindow | Window
): DataTransfer | null => {
  if (hasClipboardData(window)) {
    return window.clipboardData;
  }

  return null;
};

const isClipboardApiEnabled = (
  navigator: Navigator
): navigator is ClipboardNavigator =>
  typeof navigator === 'object' && typeof navigator.clipboard === 'object';

const NOT_ALLOWED_ERROR = new Error('NotAllowed');

const zeroStyles = (element: HTMLElement, ...properties: string[]): void => {
  for (const property of properties) {
    element.style.setProperty(property, '0');
  }
};

const createTextArea = (): HTMLTextAreaElement => {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  textArea.setAttribute('cols', '0');
  textArea.setAttribute('rows', '0');
  zeroStyles(
    textArea,
    'border-width',
    'bottom',
    'margin-left',
    'margin-top',
    'outline-width',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'right'
  );
  textArea.style.setProperty('box-sizing', 'border-box');
  textArea.style.setProperty('height', '1px');
  textArea.style.setProperty('margin-bottom', '-1px');
  textArea.style.setProperty('margin-right', '-1px');
  textArea.style.setProperty('max-height', '1px');
  textArea.style.setProperty('max-width', '1px');
  textArea.style.setProperty('min-height', '1px');
  textArea.style.setProperty('min-width', '1px');
  textArea.style.setProperty('outline-color', 'transparent');
  textArea.style.setProperty('position', 'absolute');
  textArea.style.setProperty('width', '1px');
  document.body.appendChild(textArea);

  return textArea;
};

const removeElement = (element: HTMLElement): void => {
  element.parentNode?.removeChild(element);
};

const read = (): string => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.focus();
  const success: boolean = document.execCommand('paste');

  // If we don't have permission to read the clipboard,
  //   cleanup and throw an error.
  if (!success) {
    removeElement(textArea);
    throw NOT_ALLOWED_ERROR;
  }
  const value: string = textArea.value;
  removeElement(textArea);

  return value;
};

const write = (text: string): void => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.value = text;
  textArea.select();
  const success: boolean = document.execCommand('copy');
  removeElement(textArea);
  if (!success) {
    throw NOT_ALLOWED_ERROR;
  }
};

const useClipboard = (): ClipboardTuple => {
  const [clipboard, setClipboard] = React.useState('');

  // If the user manually updates their clipboard,
  //   re-render with the new value.
  React.useEffect((): VoidFunction | void => {
    if (isClipboardApiEnabled(navigator)) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const clipboardListener = ({ clipboardData }: ClipboardEvent): void => {
        const dataTransfer: DataTransfer | null =
          clipboardData ?? getClipboardData(window) ?? null;
        if (dataTransfer) {
          const text = dataTransfer.getData('text/plain');
          if (clipboard !== text) {
            setClipboard(text);
          }
        }
      };
      navigator.clipboard.addEventListener('copy', clipboardListener);
      navigator.clipboard.addEventListener('cut', clipboardListener);

      return (): void => {
        if (isClipboardApiEnabled(navigator)) {
          navigator.clipboard.removeEventListener('copy', clipboardListener);
          navigator.clipboard.removeEventListener('cut', clipboardListener);
        }
      };
    }

    // Fallback to reading document.getSelection
    const clipboardListener = (): void => {
      try {
        const selection: Selection | null = document.getSelection();
        if (selection) {
          setClipboard(selection.toString());
        }
      } catch {
        //
      }
    };
    document.addEventListener('copy', clipboardListener);
    document.addEventListener('cut', clipboardListener);

    return (): void => {
      document.removeEventListener('copy', clipboardListener);
      document.removeEventListener('cut', clipboardListener);
    };
  }, [clipboard]);

  const syncClipboard = React.useCallback(
    async (text: string): Promise<void> => {
      try {
        write(text);
        setClipboard(text);
      } catch {
        if (isClipboardApiEnabled(navigator)) {
          try {
            await navigator.clipboard.writeText(text);
            setClipboard(text);
          } catch {
            //
          }
        }
      }
    },
    []
  );

  // Try to read synchronously.
  React.useLayoutEffect((): void => {
    try {
      const text: string = read();
      if (clipboard !== text) {
        setClipboard(text);
      }
    } catch {
      // If synchronous reading is disabled, try to read asynchronously.
      if (isClipboardApiEnabled(navigator)) {
        (async (): Promise<void> => {
          try {
            const text: string = await navigator.clipboard.readText();
            if (clipboard !== text) {
              setClipboard(text);
            }
          } catch {
            //
          }
        })();
      }
    }
  }, [clipboard]);

  return [clipboard, syncClipboard];
};

export { useClipboard };
