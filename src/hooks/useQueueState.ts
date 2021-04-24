import { useState } from 'react';

function useQueueState(
  initialList: any[]
): [
  any[],
  {
    enqueue: (item: any) => number;
    dequeue: () => any | undefined;
    peek: () => any | undefined;
    length: number;
  }
] {
  const [list, setList] = useState([...initialList]);
  const length = list.length;

  function enqueue(item: any) {
    const newList = [...list, item];
    setList(newList);

    return newList.length;
  }
  function dequeue() {
    if (list.length > 0) {
      const firstItem = list[0];
      setList([...list.slice(1)]);

      return firstItem;
    }

    return undefined;
  }

  function peek() {
    if (length > 0) {
      return list[0];
    }

    return undefined;
  }
  const controls = {
    dequeue,
    enqueue,
    length,
    peek,
  };

  return [list, controls];
}

export { useQueueState };
