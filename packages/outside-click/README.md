# @rooks/use-outside-click

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)![](https://img.shields.io/npm/v/@rooks/use-outside-click/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-outside-click.svg)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-outside-click
```

### Usage

```jsx
function Demo() {
  const pRef = useRef();
  function outsidePClick() {
    alert("Clicked outside p");
  }
  useOutsideClick(pRef, outsidePClick);
  return (
    <div>
      <p ref={pRef}>Click outside me</p>
    </div>
  );
}

render(<Demo />);
```

# React hook for tracking clicks outside a ref.
