---
id: useFocus
title: useFocus
sidebar_label: useFocus
---

## About

Handles focus events for the immediate target element.

## Examples

```tsx
import { useFocus } from "rooks";
export default function App() {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const { focusProps } = useFocus<HTMLInputElement>({
    onFocus: () => {
      console.log("focus");
    },
    onBlur: () => {
      console.log("blur");
    },
    onFocusChange: (isFocused) => {
      setIsFocus(isFocused);
    },
  });

  return (
    <label style={{ display: "block" }}>
      Name:
      <input
        {...focusProps}
        style={{
          border: isFocus ? "3px solid orange" : "1px solid gray",
        }}
      />
    </label>
  );
}
```
