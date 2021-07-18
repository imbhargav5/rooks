[![npm version](https://img.shields.io/npm/v/react-textarea-autosize.svg)](https://www.npmjs.com/package/react-textarea-autosize)
[![npm](https://img.shields.io/npm/dm/react-textarea-autosize.svg)](https://www.npmjs.com/package/react-textarea-autosize)

# react-textarea-autosize

Drop-in replacement for the textarea component which automatically resizes
textarea as content changes. A native React version of the popular [jQuery
Autosize](http://www.jacklmoore.com/autosize/)!

This module supports IE9 and above.

```javascript
import Textarea from "react-textarea-autosize";

// If you use CommonJS syntax:
// var Textarea = require('react-textarea-autosize').default;

React.renderComponent(
  <div>
    <Textarea />
  </div>,
  document.getElementById("element")
);
```

## Install

`npm install react-textarea-autosize`

## Demo

https://andreypopp.github.io/react-textarea-autosize/

## FAQ

### How to focus

Get a ref to inner textarea:

```js
<Textarea inputRef={tag => (this.textarea = tag)} />
```

And then call a focus on that ref:

```js
this.textarea.focus();
```

To autofocus:

```js
<Textarea autoFocus />
```

(all HTML attributes are passed to inner textarea)

### How to test it with jest and react-test-renderer

Because [jest](https://github.com/facebook/jest) provides polyfills for DOM
objects by requiring [jsdom](https://github.com/tmpvar/jsdom) and
[react-test-renderer](https://www.npmjs.com/package/react-test-renderer) doesn't
provide refs for rendered components out of the box (calling ref callbacks with
`null`), you need to supply a mocked ref in your tests. You can do it like this
(more can be read
[here](https://github.com/facebook/react/issues/7740#issuecomment-247335106)):

```js
const tree = renderer
  .create(<Textarea />, {
    createNodeMock: () => document.createElement("textarea")
  })
  .toJSON();
```

## Development

To release patch, minor or major version:

    % npm run release:patch
    % npm run release:minor
    % npm run release:major

This will run eslint, compile sources from `src/` to `dist/`, bump a version in
`package.json` and then create a new git commit with tag. If tests or linter
fails — commit won't be created. If tasks succeed it publishes to npm and
pushes a tag to github.
