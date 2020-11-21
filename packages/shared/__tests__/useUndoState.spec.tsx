/**
 * @jest-environment jsdom
 */
import React from "react"
import {useUndoState} from "../useUndoState"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;

describe('useUndoState', () => {
  afterEach(cleanup)
  let useHook
    beforeEach(() => {
        useHook = function(defaultValue, options){
            const [value, setValue, undo] = useUndoState(defaultValue, options)
            function increment(){
                setValue(current => (current || 0) + 1)
            }
            return {value, increment, undo}
        }
    })

  it('should be defined', () => {
    expect(useUndoState).toBeDefined()
  })

  it('should honor default value', () => {
    const {result} = renderHook(() => useHook(42));
    expect(result.current.value).toBe(42);
  })

  it('should show latest value', () => {
    const {result} = renderHook(() => useHook(42));
    
    act(() => {
      result.current.increment();
    })

    expect(result.current.value).toBe(43)
  })

  it.skip('should show previous value after undo', () => {
    const {result} = renderHook(() => useHook(42));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.undo();
    })

    expect(result.current.value).toBe(43)
  })

  it('should show initial value after multiple undo', () => {
    const {result} = renderHook(() => useHook(42));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
    })

    expect(result.current.value).toBe(42)
  })

  it.skip('should respect maxSize option', () => {
    const {result} = renderHook(() => useHook(42, {maxSize : 2}));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
    })

    expect(result.current.value).toBe(44)
  })
})

// figure out tests
