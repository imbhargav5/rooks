---
id: useMultiSelectableList
title: useMultiSelectableList
sidebar_label: useMultiSelectableList
---

## About

A custom hook to easily select multiple values from a list

[//]: # "Main"

## Examples

```jsx
import { useEffect, useState } from "react";
import "./styles.css";
import { useMultiSelectableList } from "rooks";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  .App {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

h3 {
  text-align: center;
}

.topping {
  margin-top: 0.3rem;
  vertical-align: text-bottom;
}

.result {
  margin-top: 1rem;
}

.toppings-list,
.total {
  width: 30%;
  margin: 0 auto;
}

.toppings-list {
  list-style: none;
  padding: 0;
}

.toppings-list li {
  margin-bottom: 0.5rem;
}

.toppings-list-item {
  display: flex;
  justify-content: space-between;
}

.toppings-list li:last-child {
  border-top: 1px solid #ccc;
  margin-top: 1rem;
  padding-top: 1rem;
}

.toppings-list-item label {
  vertical-align: text-bottom;
  margin-left: 0.2rem;
}

.total {
  margin-top: 1rem;
}

@media screen and (max-width: 600px) {
  .toppings-list,
  .total {
    width: 90%;
  }
}

`;

export const toppings = [
  {
    name: "Capsicum",
    price: 1.2,
  },
  {
    name: "Paneer",
    price: 2.0,
  },
  {
    name: "Red Paprika",
    price: 2.5,
  },
  {
    name: "Onions",
    price: 3.0,
  },
  {
    name: "Extra Cheese",
    price: 3.5,
  },
];

export default function App() {
  const [total, setTotal] = useState(0);
  const [
    selection,
    { matchSelection, toggleSelection, updateSelections },
  ] = useMultiSelectableList(toppings, [0, 1]);

  useEffect(() => {
    setTotal(selection[1].reduce((acc, cur) => acc + cur.price, 0));
  }, [selection]);

  return (
    <div className="App">
      <GlobalStyles />
      <h3>useMultiSelectableList Example</h3>
      <ul className="toppings-list">
        {toppings.map(({ name, price }, index) => {
          return (
            <li key={index}>
              <div className="toppings-list-item">
                <div className="left-section">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    checked={matchSelection({ index })}
                    onChange={() => toggleSelection({ index })()}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
                <div className="right-section">{price}</div>
              </div>
            </li>
          );
        })}
        <li>
          <div className="toppings-list-item">
            <div className="left-section">Total:</div>
            <div className="right-section">{total}</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
```

### Arguments

| Argument value       | Type            | Description                                      | Default value |
| -------------------- | --------------- | ------------------------------------------------ | ------------- |
| list                 | Array           | A list of items of any type                      | `[]`          |
| initialSelectIndices | `Array<number>` | An array of indices that are selected initially  | `[0]`         |
| allowUnselected      | Boolean         | Whether to allow unselect when update selections | `false`       |

### Returns

Returns an array of following items:

| Return value | Type   | Description                                                                            |
| ------------ | ------ | -------------------------------------------------------------------------------------- |
| selection    | Array  | The first item is an array of selected indices, the second item is the selected values |
| methods      | Object | Object with methods to control the selectable list, see the table below                |

Methods:

| Methods          | Type                                                   | Description                                            |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| matchSelection   | `({ index?: number, value?: T }) => boolean`           | returns true if the item is selected                   |
| toggleSelection  | `({ index?: number, value?: T }) => () => void`        | returns a function to toggle an item by index or value |
| updateSelections | `({ indices?: number[], values?: T[] }) => () => void` | returns a function to update specified items           |
