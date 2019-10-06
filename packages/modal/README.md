# @rooks/use-modal

### Exposes modal logic through react context, also provides useToggle hook for controlling modal from other components

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-modal/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-modal.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-modal.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmodal)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"/></a>

### Installation

```
npm install --save @rooks/use-modal
```

### Importing the hook

```js
import useModal, { ModalProvider, useToggle } from "@rooks/use-modal"
```

### Usage

```jsx
import useModal, { ModalProvider } from "@rooks/use-modal"

const DemoBasic = () => {
  const [opened, toggle] = useModal();

  return (
    <>
      <button onClick={toggle}>Toggle modal</button>
      {opened && (
        <div style={modalStyle}>
          <button onClick={() => toggle(false)}>Close</button>
        </div>
      )}
    </>
  );
}

// make sure to wrap your app inside ModalProvider
render(
  <ModalProvider>
    <DemoBasic />
  </ModalProvider>
)
```

### Toggle from other component

```jsx
import useModal, { ModalProvider, useToggle } from "@rooks/use-modal"

const DemoNested = () => {
  // register modal with id 'main'
  const [opened, toggle] = useModal('main');

  return (
    <>
      {opened && (
        <div style={modalStyle}>
          <button onClick={toggle}>Close</button>
        </div>
      )}
    </>
  );
}

const ToggleButton = () => {
  // not we reference the same modal here
  // useToggle returns the toggle method for 'main' modal
  // we can now use it to toggle modal from this component
  const toggleMain = useToggle('main');

  return <button onClick={toggleMain}>Toggle nested modal</button>;
}

// make sure to wrap your app inside ModalProvider
render(
  <ModalProvider>
    <ToggleButton />
    <DemoNested />
  </ModalProvider>
)
```
