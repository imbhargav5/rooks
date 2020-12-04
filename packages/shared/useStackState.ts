import { useMemo, useState } from "react";


function useStackState(initialList: any[]): [any[],
{
  push: (item: any) => number,
  pop: () => any | undefined,
  peek: () => any | undefined,
  length: number
}, any[]] {
  const [list, setList] = useState([...initialList]);
  const length = list.length

  const listInReverse = useMemo(() => {
    const reverseList = [...list];
    reverseList.reverse();
    return reverseList;
  },[list])

  function push(item: any){
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
