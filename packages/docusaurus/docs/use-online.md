---
id: use-online
title: use-online
sidebar_label: use-online
---

## @rooks/use-online

#### Online status hook for React.

<br/>

   



### Installation

    npm install --save @rooks/use-online

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

    