import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *  useWindowEventListener hook
 *
 *  A react hook to an event listener to the window
 * 
 * @param {string} eventName The event to track
 * @param {function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @return {undefined}
 */
function useWindowEventListener(eventName: string, callback: (...args: any)=> void, listenerOptions: any = {}, isLayoutEffect : boolean = false ) : void{
    if(typeof window!=="undefined"){
      useGlobalObjectEventListener(window, eventName, callback, listenerOptions, true, isLayoutEffect);
    }else{
      console.warn("useWindowEventListener can't attach an event listener as window is undefined.")
    }
}

export {useWindowEventListener};
