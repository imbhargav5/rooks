---
id: useInfiniteScroll
title: useInfiniteScroll
sidebar_label: useInfiniteScroll
---

## About

A custom React hook that handles infinite scrolling by fetching additional data when the user scrolls to the bottom of the page. It manages the current page, accumulates fetched data, and handles loading and error states.

## Examples

```tsx
import { useInfiniteScroll } from "rooks";

interface DataItem {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function App() {
  const fetchMoreData = async (page: number): Promise<DataItem[]> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${page}`
    )
      .then((res) => res.json())
      .catch((e) => {
        throw new Error(e.message);
      });
    return response;
  };

  const { data, isLoading, isLastPage, loadMoreRef } =
    useInfiniteScroll<DataItem>(fetchMoreData);
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          {item.id}: {item.title}
        </div>
      ))}
      {!isLoading && <span ref={loadMoreRef}></span>}
      {isLastPage && <p>You are all caught up...</p>}
      {isLoading && <p>Loading More data...</p>}
    </div>
  );
}
```

### Arguments

| Argument    | Type                           | Description                                                                                                                  | Default Value                                                    | Required |
| ----------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| fetchData   | (page: number) => Promise<T[]> | A function that fetches data from the API and returns a promise that resolves to the new data.                               | undefined                                                        | yes      |
| initialData | T[]                            | An optional parameter to set the initial state of the data.                                                                  | [ ]                                                              | no       |
| options     | IntersectionObserverInit       | Intersection Observer config ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#properties)) | `{ root: null,rootMargin: "0px 0px 0px 0px", threshold: [0, 1]}` | no       |

### Return

| Return value | Type          | Description                                                    |
| ------------ | ------------- | -------------------------------------------------------------- |
| apiResponse  | T[]           | The accumulated data fetched from the API.                     |
| isLoading    | Boolean       | Indicates whether data is currently being loaded.              |
| isLastPage   | Boolean       | Return true when reached the last.                             |
| error        | Error or null | Stores any error that occurs during data fetching.             |
| loadMoreRef  | CallbackRef   | ref for the React component/element that needs to be observed. |

---
