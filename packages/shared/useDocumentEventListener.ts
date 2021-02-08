import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

/**
 *  useDocumentEventListener hook
 *
 *  A react hook to an event listener to the document
 * 
 * @param {string} eventName The event to track
 * @param {function} callback The callback to be called on event
 * @param {object} conditions The options to be passed to the event listener
 * @param {boolean} isLayoutEffect Should it use layout effect. Defaults to false
 * @return {undefined}
 */
function useDocumentEventListener(eventName: string, callback: (...args: any)=> void, listenerOptions: any = {}, isLayoutEffect : boolean = false ) : void{
  if(typeof document!=="undefined"){
    useGlobalObjectEventListener(document, eventName, callback, listenerOptions, true, isLayoutEffect);
  }else{
    console.warn("useDocumentEventListener can't attach an event listener as document is undefined.")
  }
}

export {useDocumentEventListener};
