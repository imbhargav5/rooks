---
id: useHighlight
title: useHighlight
sidebar_label: useHighlight
---

## About

search for a keyword in the DOM and highlight them, you need to add a global style for the mark tag for this purpose

## Examples

```tsx
import { useHighlight } from "rooks";
export default function App() {
  const ref = useHighlight("something", { when: true });
  return (
    <div ref={ref}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
        something, something something eleifend sem ac, something blandit
        lectus. Integer something something nulla something something aliquet.
        Donec something something something non ultricies something. Quisque
        something something something gravida vestibulum. Nullam something
        something something lobortis something. Maecenas something something
        something something something scelerisque. Vestibulum something
        something
      </p>
    </div>
  );
}
```

### Arguments

| Argument | Type     | Description                                                                                    | Default value                                          |
| -------- | -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| keyword  | string   | the word you want to search for it in the DOM, you can use input value or query param for it   | empty string                                           |
| when     | boolean  | When your content is fetched, you assign a boolean value of true to this argument.             | false                                                  |
| render   | Function | this function that receives the matched keyword as an argument and returns the desired markup. | (match) => `<mark class="highlighted">${match}</mark>` |

### Return Value

| Name | Type        | Description                                                           |
| ---- | ----------- | --------------------------------------------------------------------- |
| ref  | HTMLElement | Reference to the container where you want to search for your content. |
