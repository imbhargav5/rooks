---
id: useNavigatorLanguage
title: useNavigatorLanguage
sidebar_label: useNavigatorLanguage
---

## About

Navigator Language hook for React.

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useNavigatorLanguage } from 'rooks';
```

## Usage

```jsx
function Demo() {
  const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}

render(<Demo />);
```

### Return value

A language (String) is returned.

### Codesandbox Example

## Basic Usage

<iframe src="https://codesandbox.io/embed/usenavigatorlanguage-pnk7f?fontsize=14&hidenavigation=1&theme=dark"
   style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
title="useNavigatorLanguage"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
