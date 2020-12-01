/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import {usePreviousDifferent} from "../usePreviousDifferent";
import { act, renderHook } from "@testing-library/react-hooks";

describe("usePreviousDifferent", () => {
  let useHook;
  beforeEach(() => {
      useHook = function (){
          const [value, setValue] = useState(0)
          const previousValue = usePreviousDifferent(value)
          function increment(){
            setValue(value + 1)
          }
          return {value, increment, previousValue};
      }
  })
  it('isDefined', async() => {        
      expect(usePreviousDifferent).toBeDefined()
  })
  it(' initially returns null', async() => {    
    const {result} = renderHook(()=> useHook())
    expect(result.current.previousValue).toBeNull()
  })
  
  it('holds the previous value', async() => {    
      const {result} = renderHook(()=> useHook())
      act(() => {
        result.current.increment();
      })    
      expect(result.current.value).toBe(1)
      expect(result.current.previousValue).toBe(0)
  })
})
// figure out tests
