import { useMemo, useState } from "react";


function useStackState<T>(initialList: T[]): [T[],
{
  push: (item: T) => number,
  pop: () => T | undefined,
  peek: () => T | undefined,
  length: number
}, T[]] {
  const [list, setList] = useState([...initialList]);
  const length = list.length

  const listInReverse = useMemo(() => {
    const reverseList = [...list];
    reverseList.reverse();
    return reverseList;
  },[list])

  function push(item: T){
    const newList = [...list,item];
    setList(newList)
    return newList.length;
  }
  function pop(){
    if(list.length>0){
      const lastItem = list[list.length - 1];
      setList([...list.slice(0,list.length-1)])
      return lastItem;
    }
    return undefined;
  }
  
  function peek(){
    if(length>0){
      return list[length-1]
    }
    return undefined;
  }
  const controls = {
    push,
    pop,
    length,
    peek
  }
  return [list, controls, listInReverse];
}

export {useStackState};
