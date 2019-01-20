# @rooks/use-online

[![Build Status](https://travis-ci.org/imbhargav5/rooks.svg?branch=master)](https://travis-ci.org/imbhargav5/rooks)

<a href="https://spectrum.chat/rooks"><img src="https://withspectrum.github.io/badge/badge.svg" alt="Join the community on Spectrum"></a>

### Installation

```
npm install --save @rooks/use-online
```

### Usage

```jsx
function Demo() {
  const isOnline = useOnline();
  return <p>Online status - {isOnline.toString()}</p>;
}

render(<Demo />);
```

### Return value

Offline status (boolean) is returned.

Online Status hook for React.
