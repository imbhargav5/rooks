import { useEffect, useRef } from "react";
import { useFreshTick } from "./useFreshTick";
import { useRefElement } from "./useRefElement";
import { RefElementOrNull } from "./utils/utils";

/**
 *  useWindowEventListener hook
 *
 *  A react hook to an event listener to the window
 * 
 * @param {string} eventName The event to track
 * @param {function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @return {undefined}
 */
function useWindowEventListener(eventName: string, callback: (...args: any)=> void, listenerOptions: any = {} ) : void{
  const freshCallback = useFreshTick(callback);
  const {capture, passive, once} = listenerOptions;

  useEffect(() => {
    if(typeof window !=="undefined"){
      window.addEventListener(eventName, freshCallback, listenerOptions)
      return () => {
        window.removeEventListener(eventName, freshCallback, listenerOptions)
      }
    }
  }, [eventName, capture, passive, once])

}

export {useWindowEventListener};
