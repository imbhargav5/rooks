# @rooks/use-event-listener-ref


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/event-listener-ref/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-event-listener-ref/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-event-listener-ref.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-event-listener-ref.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fevent-listener-ref)



## About
A react hook to add an event listener to a ref


[//]: # (Main)

## Installation

```
npm install --save @rooks/use-event-listener-ref
```

## Importing the hook

```javascript
import useEventListenerRef from "@rooks/use-event-listener-ref"
```

## Usage

```jsx
function Demo() {
  const ref = useEventListenerRef("click", function(){
    console.log("clicked")
  });
  return <div ref={ref}>
    Click me
  </div>
}

render(<Demo/>)
```
