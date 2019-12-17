---
id: use-outside-click-ref
title: use-outside-click-ref
sidebar_label: use-outside-click-ref
---

# @rooks/use-outside-click-ref

### A hook that can track a click event outside a ref. Returns a callbackRef.

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-outside-click-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click-ref)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-outside-click-ref
```

### Importing the hook

```javascript
import useOutsideClickRef from "@rooks/use-outside-click-ref"
```

### Usage

```jsx
function Demo() {
  function outsidePClick() {
    alert("Clicked outside p");
  }
  const [ref] = useOutsideClickRef(outsidePClick);
  return (
    <div>
      <p ref={ref}>Click outside me</p>
    </div>
  );
}

render(<Demo/>)
```

    