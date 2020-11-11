---
id: use-navigator-language
title: use-navigator-language
sidebar_label: use-navigator-language
---

   

## About

Navigator Language hook for React.
<br/>

## Installation

    npm install --save @rooks/use-navigator-language

## Importing the hook

```javascript
import useNavigatorLanguage from "@rooks/use-navigator-language";
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


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    