import React from 'react'
import { renderHook } from "@testing-library/react-hooks";
import { render, getByTestId, fireEvent, cleanup } from "@testing-library/react";
import { useWindowEventListener } from "../useWindowEventListener";
import {useCounter} from '../useCounter'
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;


describe("useWindowEventListener", () => {
  it("should be defined", () => {
    expect(useWindowEventListener).toBeDefined()
  })
  it('should return a undefined', () =>{
    const { result } = renderHook(() => useWindowEventListener("click", function(){
        console.log("clicked")
    }))
     
    expect(typeof result.current).toBe("undefined")
  })  
})

describe("useWindowEventListener jsx", () => {
    let mockCallback;
     let TestJSX
     beforeEach(() => {
         mockCallback = jest.fn(() => {});
         TestJSX = function(){
            useWindowEventListener("click", mockCallback);
            return null;
         }
     })
     
    
    it('should not call callback by default', () =>{
        render(<TestJSX />);
        expect(mockCallback).toBeCalledTimes(0);
      })

         
    it('should not call callback when event fires', () =>{
        render(<TestJSX />);
        act(() => {
            fireEvent.click(window)
        })
        expect(mockCallback).toBeCalledTimes(1);
        act(() => {
            fireEvent.click(window)
            fireEvent.click(window)
            fireEvent.click(window)
        })
        expect(mockCallback).toBeCalledTimes(4);
      })
})


describe("useWindowEventListener state variables", () => {
    let mockCallback;
     let TestJSX
     beforeEach(() => {
         mockCallback = jest.fn(() => {});
         TestJSX = function(){
            const {increment, value} = useCounter(0);
            useWindowEventListener("click", increment);
            return <div data-testid="value">{value}</div>;
         }
     })
     
    
    it('should not call callback by default', () =>{
        const { container } = render(<TestJSX />);
        const valueElement = getByTestId(container as HTMLElement, "value");
        expect(parseInt(valueElement.innerHTML)).toBe(0);
      })

         
    it('should not call callback when event fires', () =>{
        const { container } = render(<TestJSX />);
        const valueElement = getByTestId(container as HTMLElement, "value");
        expect(parseInt(valueElement.innerHTML)).toBe(0);
        act(() => {
            fireEvent.click(window)
            fireEvent.click(window)
            fireEvent.click(window)
        })
        expect(parseInt(valueElement.innerHTML)).toBe(3);
      })
})
