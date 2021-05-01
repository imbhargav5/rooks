# @rooks/use-media-match


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/media-match/title-card.svg)

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
