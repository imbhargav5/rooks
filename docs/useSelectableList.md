---
id: useSelectableList
title: useSelectableList
sidebar_label: useSelectableList
---

## About

Easily select a single value from a list of values. very useful for radio buttons, select inputs etc.

[//]: # "Main"

## Installation

    npm install --save rooks

## Importing the hook

```javascript
import { useSelectableList } from "rooks";
```

## Usage

```jsx
function Demo() {
  const [total, setTotal] = useState(0);
  const [selection, { matchSelection, toggleSelection, updateSelection }] =
    useSelectableList(toppings, 0);

  useEffect(() => {
    setTotal(selection[1].price);
  }, [selection]);

  return (
    <div className="App">
      <h3>useSelectableList Example</h3>
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

render(<Demo />);
```

### Arguments

| Argument value  | Type      | Description                                     | Default value |
| --------------- | --------- | ----------------------------------------------- | ------------- |
| list            | Array     | A list of items of any type                     | `[]`          |
| initialIndex    | `number`  | Index of the initially selected item            | `0`           |
| allowUnselected | `boolean` | Whether to allow unselect when update selection | `false`       |

### Returns

Returns an array of following items:

| Return value | Type   | Description                                                                 |
| ------------ | ------ | --------------------------------------------------------------------------- |
| selection    | Array  | The first item is the selected index, the second item is the selected value |
| methods      | Object | Object with methods to control the selectable list, see the table below     |

Methods:

| Methods         | Type                                            | Description                                            |
| --------------- | ----------------------------------------------- | ------------------------------------------------------ |
| matchSelection  | `({ index?: number, value?: T }) => Boolean`    | returns true if the item is selected                   |
| toggleSelection | `({ index?: number, value?: T }) => () => void` | returns a function to toggle an item by index or value |
| updateSelection | `({ index?: number, value?: T }) => () => void` | returns a function to update specified item            |

---

## Codesandbox Examples

### Basic Usage

<iframe src="https://codesandbox.io/embed/useselectablelist-ir55c?fontsize=14&hidenavigation=1&theme=dark"
  style={{
    width: "100%",
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: "hidden"
  }} 
  title="useSelectableList usage"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

## Join Bhargav's discord server

You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.
