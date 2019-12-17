---
id: version-3.5.0-use-did-update
title: use-did-update
sidebar_label: use-did-update
original_id: use-did-update
---

# @rooks/use-did-update

### componentDidUpdate hook for react

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-did-update/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-did-update.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-did-update.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fdid-update)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-did-update
```

### Importing the hook

```javascript
import useDidUpdate from "@rooks/use-did-update";
```

### Usage

```jsx
function Demo() {
  const [value, setValue] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);
  useDidUpdate(() => {
    console.log("Update");
    setHasUpdated(true);
  }, [value]);
  return (
    <>
      <button onClick={() => setValue(value + 1)}>Value is {value}</button>
      <p>Has updated - {hasUpdated.toString()}</p>
      <p>Please check the console for logs.</p>
    </>
  );
}

render(<Demo />);
```

    