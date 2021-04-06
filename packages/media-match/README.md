# @rooks/use-media-match

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/media-match/title-card.svg)

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks) ![](https://img.shields.io/npm/v/@rooks/use-media-match/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-media-match.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-media-match.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fmedia-match)

## About

Signal whether or not a media query is currently matched.

[//]: # 'Main'

## Installation

```
npm install --save @rooks/use-media-match
```

## Importing the hook

```javascript
import useMediaMatch from '@rooks/use-media-match';
```

## Usage

```jsx
function Demo() {
  const isNarrowWidth = useMediaMatch('(max-width: 600px)');
  return <span>Your screen is {isNarrowWidth ? 'narrow' : 'wide'}.</span>;
}

render(<Demo />);
```
