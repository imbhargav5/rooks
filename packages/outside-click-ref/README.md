# @rooks/use-outside-click-ref

### A hook that can track a click event outside a ref. Returns a callbackRef.

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-outside-click-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-outside-click-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Foutside-click-ref)

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

### Arguments

| Arguments       | Type      | Description                                                                                                                                      | Default value |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| ref             | React ref | Ref whose outside click needs to be listened to                                                                                                  | N/A           |
| handler         | function  | Callback to fire on outside click                                                                                                                | N/A           |
| when            | boolean   | A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click                                       | true          |
| listenMouseDown | boolean   | A boolean which switches the hook to listen to `mousedown` event instead of `click`. Useful when user might start drag instead of regular clicks | false         |

### Returns an array of 1 value

| Return value | Type         | Description                                                                        | Default value |
| ------------ | ------------ | ---------------------------------------------------------------------------------- | ------------- |
| ref          | Callback ref | A callback ref function to use as a ref for the component that needs to be tracked | () => null    |
