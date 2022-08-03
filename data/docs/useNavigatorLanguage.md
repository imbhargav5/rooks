---
id: useNavigatorLanguage
title: useNavigatorLanguage
sidebar_label: useNavigatorLanguage
---

## About

Navigator Language hook for React.

## Examples

```jsx
import "./styles.css";
import { useNavigatorLanguage } from "rooks";

function App() {
  const language = useNavigatorLanguage();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Rooks : useNavigatorLanguage example</h1>
      <p style={{ fontSize: "20px" }}>
        Language is <b>{language}</b>
      </p>
    </div>
  );
}

export default App;
```

### Return value

A language (String) is returned.
