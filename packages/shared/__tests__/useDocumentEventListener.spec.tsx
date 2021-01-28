import React from 'react'
import { renderHook } from "@testing-library/react-hooks";
import { render, getByTestId, fireEvent, cleanup } from "@testing-library/react";
import { useDocumentEventListener } from "../useDocumentEventListener";
import {useCounter} from '../useCounter'
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;


describe("useDocumentEventListener", () => {
  it("should be defined", () => {
    expect(useDocumentEventListener).toBeDefined()
  })
  it('should return a undefined', () =>{
    const { result } = renderHook(() => useDocumentEventListener("click", function(){
        console.log("clicked")
    }))
     
    expect(typeof result.current).toBe("undefined")
  })  
})

describe("useDocumentEventListener jsx", () => {
    let mockCallback;
     let TestJSX
     beforeEach(() => {
         mockCallback = jest.fn(() => {});
         TestJSX = function(){
            useDocumentEventListener("click", mockCallback);
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
            fireEvent.click(document)
        })
        expect(mockCallback).toBeCalledTimes(1);
        act(() => {
            fireEvent.click(document)
            fireEvent.click(document)
            fireEvent.click(document)
        })
        expect(mockCallback).toBeCalledTimes(4);
      })
})


describe("useDocumentEventListener state variables", () => {
    let mockCallback;
     let TestJSX
     beforeEach(() => {
         mockCallback = jest.fn(() => {});
         TestJSX = function(){
            const {increment, value} = useCounter(0);
            useDocumentEventListener("click", increment);
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
            fireEvent.click(document)
            fireEvent.click(document)
            fireEvent.click(document)
        })
        expect(parseInt(valueElement.innerHTML)).toBe(3);
      })
})
