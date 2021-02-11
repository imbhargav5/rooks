# @rooks/use-online
![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/online/title-card.svg)

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
