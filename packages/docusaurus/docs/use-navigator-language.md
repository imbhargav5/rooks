---
id: use-navigator-language
title: use-navigator-language
sidebar_label: use-navigator-language
---

## @rooks/use-navigator-language

#### Navigator Language hook for React.

<br/>

   



### Installation

    npm install --save @rooks/use-navigator-language

### Importing the hook

```javascript
import useNavigatorLanguage from "@rooks/use-navigator-language";
```

### Usage

```jsx
function Demo() {
  const language = useNavigatorLanguage();
  return <p>Language is {language}</p>;
}

render(<Demo />);
```

### Return value

A language (String) is returned.

    