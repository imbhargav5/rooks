---
id: use-countdown
title: use-countdown
sidebar_label: use-countdown
---

## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

    npm install rooks

or

    yarn add rooks

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

    

## About

Count down to a target timestamp and call callbacks every second (or provided peried)

## Installation

    npm install --save @rooks/use-countdown

## Importing the hook

```javascript
import useCountdown from "@rooks/use-countdown"
```

## Usage

```jsx
const endTime = new Date(Date.now() + 10000);

function Demo() {
  const count = useCountdown(endTime, {
    interval: 1000,
    onDown: time => console.log('onDown', time),
    onEnd: time => console.log('onEnd', time),
  });
  return count;
}

render(<Demo/>)
```

### Arguments

| Argument         | Type     | Description                                                         | Default value |
| ---------------- | -------- | ------------------------------------------------------------------- | ------------- |
| endTime          | Date     | the time when the countdown should end                              | undefined     |
| options.interval | number   | milliseconds that it takes count down once                          | 1000          |
| options.onDown   | function | (time) => {}, callback that would be called every interval          | undefined     |
| options.onEnd    | function | (time) => {}, callback that would be called when the countdown ends | undefined     |

### Return Value

| Type   | Description                                                    |
| ------ | -------------------------------------------------------------- |
| number | rest amount of intervals it takes to count down to the endTime |


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    