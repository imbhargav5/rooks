# @rooks/use-navigator-language

### Navigator Language hook for React.

<br/>

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-navigator-language/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-navigator-language.svg) ![](https://img.shields.io/npm/dt/@rooks/use-navigator-language.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fnavigator-language)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-navigator-language
```

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
