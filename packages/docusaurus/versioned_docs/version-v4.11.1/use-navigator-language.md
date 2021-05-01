---
id: use-navigator-language
title: use-navigator-language
sidebar_label: use-navigator-language
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

   

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

    