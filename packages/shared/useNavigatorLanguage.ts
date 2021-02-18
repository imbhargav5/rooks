import {useState} from 'react'
import { useWindowEventListener } from './useWindowEventListener';

type Language = string | null

function getLanguage(): Language{
  if(typeof navigator !== "undefined"){
    return navigator.language || navigator["userLanguage"]
  }else{
    return null;
  }
}

/**
 * useNavigatorLanguage hook
 * Returns the language of the navigator
 * @return {Language}
 */
export function useNavigatorLanguage(): Language {
  const [language, setLanguage] = useState<Language>(getLanguage);

  useWindowEventListener("languagechange", ()=>{
    setLanguage(getLanguage)
  })
  
  return language;
}
