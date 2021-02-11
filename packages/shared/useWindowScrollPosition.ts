import { useState } from "react";
import { useOnWindowResize } from "./useOnWindowResize";
import { useOnWindowScroll } from "./useOnWindowScroll";

type ScrollPosition = {
  scrollX: number
  scrollY: number
}

function getScrollPosition(): ScrollPosition{
  if(typeof window!== "undefined"){
    return {
      scrollX : window.pageXOffset,
      scrollY : window.pageYOffset
    }
  }else{
    return {
      scrollX : 0,
      scrollY : 0
    }
  }
  
}

/**
 *
 * useWindowScrollPosition hook
 * A React hook to get the scroll position of the window
 * @returns an object containing scrollX and scrollY values
 */
function useWindowScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(getScrollPosition)
  /** 
   * Recalculate on scroll
  */
  useOnWindowScroll(function(){
    setScrollPosition(getScrollPosition())
  }, true, true)
  /** 
   * Recalculate on resize
  */
  useOnWindowResize(function(){
    setScrollPosition(getScrollPosition())
  }, true, true)
  return scrollPosition;
}

export {useWindowScrollPosition};
