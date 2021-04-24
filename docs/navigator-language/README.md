# @rooks/use-navigator-language
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/navigator-language/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-navigator-language/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-navigator-language.svg) ![](https://img.shields.io/npm/dt/@rooks/use-navigator-language.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fnavigator-language)





## About 
Navigator Language hook for React.
<br/>


## Installation

```
npm install --save @rooks/use-navigator-language
```

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
