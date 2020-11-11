---
id: use-countdown
title: use-countdown
hide_title: true
sidebar_label: use-countdown
---

# @rooks/use-countdown

### Count down to a target timestamp and call callbacks every second (or provided peried)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg) ![](https://img.shields.io/npm/v/@rooks/use-countdown/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-countdown.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-countdown.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fcountdown)



### Installation

    npm install --save @rooks/use-countdown

### Importing the hook

```javascript
import useCountdown from "@rooks/use-countdown"
```

### Usage

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

    