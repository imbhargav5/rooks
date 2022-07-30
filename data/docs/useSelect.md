---
id: useSelect
title: useSelect
sidebar_label: useSelect
---

## About

Select values from a list easily. List selection hook for react.

## Examples

### Basic usage

```jsx
import "./styles.css";
import { useSelect } from "rooks";

const list = [
  {
    heading: "Awesome",
    content: "Great, tell me about it!",
  },
  {
    heading: "I don't know",
    content: "That's okay.",
  },
  {
    heading: "Worst",
    content: "The day is young.",
  },
];

export default function App() {
  const { index, setIndex, item } = useSelect(list, 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <h1>Rooks: useSelect Example</h1>
      <h3>How're you feeling today?</h3>
      {list.map((listItem, listItemIndex) => (
        <button
          key={listItemIndex}
          style={{
            background: index === listItemIndex ? "Teal" : "inherit",
          }}
          onClick={() => setIndex(listItemIndex)}
        >
          {listItem.heading}
        </button>
      ))}
      <p>{item.content}</p>
    </div>
  );
}
```

### Arguments

| Argument     | Type   | Description                                   | Default value |
| ------------ | ------ | --------------------------------------------- | ------------- |
| list         | Array  | List of items for which the selection is used | undefined     |
| initialIndex | number | Initially selected index                      | 0             |

### Returned Object

| Returned object attributes | Type     | Description                       |
| -------------------------- | -------- | --------------------------------- |
| index                      | int      | Index of currently selected index |
| item                       | any      | Currently selected item           |
| setIndex                   | function | Update selected index             |
| setItem                    | function | Update selected item              |
