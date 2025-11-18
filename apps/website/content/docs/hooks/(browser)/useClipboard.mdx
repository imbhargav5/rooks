---
id: useClipboard
title: useClipboard
sidebar_label: useClipboard
---

## About

React hook for reading from and writing to the system clipboard using the Clipboard API.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useClipboard } from "rooks";

function ClipboardDemo() {
  const { copy, paste, text, isSupported, error } = useClipboard();
  const [inputValue, setInputValue] = useState("");

  const handleCopy = async () => {
    try {
      await copy(inputValue);
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePaste = async () => {
    try {
      await paste();
      console.log("Pasted from clipboard!");
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  if (!isSupported) {
    return <div>Clipboard API not supported in this browser</div>;
  }

  return (
    <div>
      <h2>Clipboard Demo</h2>
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter text to copy"
        />
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handlePaste}>Paste</button>
      </div>
      {text && (
        <div>
          <strong>Clipboard content:</strong> {text}
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property      | Type                              | Description                                         |
| ------------- | --------------------------------- | --------------------------------------------------- |
| text          | `string \| null`                  | The current text content from the clipboard         |
| copy          | `(value: string) => Promise<void>`| Copy text to the clipboard                          |
| paste         | `() => Promise<void>`             | Read text from the clipboard                        |
| isSupported   | `boolean`                         | Whether the Clipboard API is supported              |
| error         | `Error \| null`                   | Any error that occurred during clipboard operations |

## Features

- **Copy text to clipboard** - Write text using the Clipboard API
- **Read from clipboard** - Read text from the system clipboard
- **Error handling** - Comprehensive error handling for permission issues
- **Browser support detection** - Detects if Clipboard API is available
- **TypeScript support** - Full type definitions included

## Browser Support

The Clipboard API requires:
- HTTPS context (or localhost for development)
- User permission for clipboard access
- Modern browsers (Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+)

## Notes

- The clipboard read operation requires user permission in most browsers
- Some browsers may show a permission prompt when accessing the clipboard
- The hook automatically handles errors and permission denials
- Works only in secure contexts (HTTPS or localhost)
