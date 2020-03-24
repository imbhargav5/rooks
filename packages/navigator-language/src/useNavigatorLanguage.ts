import {useMemo} from 'react'
/**
 * useNavigatorLanguage hook
 *
 * Returns the language of the navigator
 *
 * @return {string|null}
 */
const getLanguage(){
  if(typeof navigator !== "undefined"){
    return navigator.language || navigator["userLanguage"]
  }else{
    return null;
  }
}
export function useNavigatorLanguage(): string | null {
  return getLanguage();
}
