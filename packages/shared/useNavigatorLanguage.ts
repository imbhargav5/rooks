import {useMemo} from 'react'
/**
 * useNavigatorLanguage hook
 *
 * Returns the language of the navigator
 *
 * @return {string|null}
 */
function getLanguage(): string | null{
  if(typeof navigator !== "undefined"){
    return navigator.language || navigator["userLanguage"]
  }else{
    return null;
  }
}
export function useNavigatorLanguage(): string | null {
  return useMemo(() => getLanguage(),[]);
}
