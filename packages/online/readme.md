# @rooks/use-online

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/online/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-online/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-online.svg) ![](https://img.shields.io/npm/dt/@rooks/use-online.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fonline)




## About
Online status hook for React.
<br/>

### Installation

```
npm install --save @rooks/use-online
```

### Importing the hook

```javascript
import useOnline from "@rooks/use-online";
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo />);
```

### Return value

Offline status (boolean) is returned.
