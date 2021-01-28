import { useEffect, useRef } from "react";
import { useFreshTick } from "./useFreshTick";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { useRefElement } from "./useRefElement";
import { RefElementOrNull } from "./utils/utils";

/**
 *  useGlobalObjectEventListener hook
 *
 *  A react hook to an event listener to a global object
 * 
 * @param {Window|Document} globalObject The global object to add event onto
 * @param {string} eventName The event to track
 * @param {function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @return {undefined}
 */
function useGlobalObjectEventListener(globalObject: Window | Document, eventName: string, callback: (...args: any)=> void, listenerOptions: any = {}, isLayoutEffect : boolean = false ) : void{
  const freshCallback = useFreshTick(callback);
  const {capture, passive, once} = listenerOptions;
  const useEffectToRun = isLayoutEffect ? useIsomorphicEffect : useEffect
  
  useEffectToRun(() => {
    if(typeof globalObject !=="undefined"){
      globalObject.addEventListener(eventName, freshCallback, listenerOptions)
      return () => {
        globalObject.removeEventListener(eventName, freshCallback, listenerOptions)
      }
    }
  }, [eventName, capture, passive, once])

}

export {useGlobalObjectEventListener};
