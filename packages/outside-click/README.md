# @rooks/use-outside-click

### Outside click(for a ref) event as hook for React.

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-outside-click/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click.svg) ![](https://img.shields.io/npm/dt/@rooks/use-outside-click.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-outside-click
```

### Importing the hook

```javascript
import useOutsideClick from "@rooks/use-outside-click";
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


### Arguments

| Arguments       | Type      | Description                                                                                                                                      | Default value |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| ref             | React ref | Ref whose outside click needs to be listened to                                                                                                  | N/A           |
| handler         | function  | Callback to fire on outside click                                                                                                                | N/A           |
| when            | boolean   | A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click                                       | true          |
| listenMouseDown | boolean   | A boolean which switches the hook to listen to `mousedown` event instead of `click`. Useful when user might start drag instead of regular clicks | false         |
