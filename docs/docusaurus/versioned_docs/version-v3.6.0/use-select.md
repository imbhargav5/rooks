---
id: use-select
title: use-select
hide_title: true
sidebar_label: use-select
---

# @rooks/use-select

### Select values from a list easily. List selection hook for react.

<br/>

![Build Status](https://github.com/imbhargav5/rooks/workflows/Node%20CI/badge.svg)![](https://img.shields.io/npm/v/@rooks/use-select/latest.svg) ![](https://img.shields.io/npm/l/@rooks/use-select.svg) ![](https://img.shields.io/npm/dt/@rooks/use-select.svg) ![](https://img.shields.io/david/imbhargav5/rooks.svg?path=packages%2Fselect)



### Installation

    npm install --save @rooks/use-select

### Importing the hook

```javascript
import useSelect from "@rooks/use-select"
```

### Usage

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

    