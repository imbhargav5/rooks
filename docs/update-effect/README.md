# @rooks/use-update-effect

![TitleCard](https://raw.githubusercontent.com/imbhargav5/rooks/HEAD/packages/update-effect/title-card.svg)

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
