# @rooks/use-update-effect


## *Note: Future updates to this package have moved to the main package* [rooks](https://npmjs.com/package/rooks). All hooks now reside in a single package which you can install using

```
npm install rooks
```

or 

```
yarn add rooks
```

Rooks is completely treeshakeable and if you use only 1 of the 50+ hooks in the package, only that hook will be bundled with your code. Your bundle will only contain the hooks that you need. Cheers!

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/v4-compat/packages/update-effect/title-card.svg)

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-update-effect/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-update-effect.svg) ![](https://img.shields.io/bundlephobia/min/@rooks/use-update-effect.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fupdate-effect)

## About

An useEffect that does not run on first render

## Installation

```
npm install --save @rooks/use-update-effect
```

## Importing the hook

```javascript
import useUpdateEffect from "@rooks/use-update-effect";
```

## Usage

```jsx
function Demo() {
  const [userID, setUserID] = useState();
  const [hasUpdated, setHasUpdated] = useState({ userID, updated: false });
  useUpdateEffect(() => {
    API.subscribe(userID);
    setHasUpdated({ userID, updated: true });
    () => {
      API.unsubscribe(userID);
      setHasUpdated({ userID, updated: false });
    };
  }, [value]);
  return (
    <>
      <button onClick={() => setUserID(Math.random())}>user ID is {userID}</button>
      <p>Has updated for userID - {hasUpdated.toString()}</p>
    </>
  );
}

render(<Demo />);
```
