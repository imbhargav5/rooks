---
id: use-select
title: use-select
sidebar_label: use-select
---

   

## About

Select values from a list easily. List selection hook for react.
<br/>

## Installation

    npm install --save @rooks/use-select

## Importing the hook

```javascript
import useSelect from "@rooks/use-select"
```

## Usage

```jsx

const list = [
  {
    heading: "Tab 1",
    content: "Tab 1 Content"
  },
  {
    heading: "Tab 2",
    content: "Tab 2 Content"
  }
];

function Demo() {
  const { index, setIndex, item } = useSelect(list, 0);
  return (
    <div>
      {list.map((listItem, listItemIndex) => (
        <button
          key={listItemIndex}
          style={{
            background: index === listItemIndex ? "dodgerblue" : "inherit"
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
render(<Demo/>)
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


## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    