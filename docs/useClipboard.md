---
id: useClipboard
title: useClipboard
sidebar_label: useClipboard
---

## About

useClipboard is a TypeScript-friendly React hook for reading from and writing to the user's clipboard. Credit goes to use-clippy.

[//]: # 'Main'

## Installation

```
npm install rooks
```

## Importing the hook

```javascript
import { useClipboard } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const [clipboard, setClipboard] = useClipboard();
  const [textAreaValue, setTextAreaValue] = useState();

  const isDisabled = clipboard === textAreaValue;

  const handleClick = React.useCallback(() => {
    setClipboard(textAreaValue);
  }, [setClipboard, textAreaValue]);

  return (
    <div>
      <textarea
        value={textAreaValue}
        onChange={(e) => setTextAreaValue(e.target.value)}
      />
      <button disabled={isDisabled} onClick={handleClick}>
        Copy
      </button>
    </div>
  );
}

render(<Demo />);
```

---

## Codesandbox Examples

### Basic Usage

---

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
