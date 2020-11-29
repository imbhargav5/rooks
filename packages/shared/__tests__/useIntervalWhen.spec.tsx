/**
 * @jest-environment jsdom
 */
import { useState } from "react";
import {useIntervalWhen} from "../useIntervalWhen";
import { renderHook, cleanup } from "@testing-library/react-hooks";
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;

describe("useIntervalWhen", () => {
    let useHook;

    beforeEach(() => {
      useHook = function(){
        const [currentValue, setCurrentValue] = useState(0);
        function increment() {
          setCurrentValue(currentValue + 1);
        }
         useIntervalWhen(() => {
          increment();
        }, 1000);
        return {currentValue}
      }
    });

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
    });

    it("should be defined", () => {
      expect(useIntervalWhen).toBeDefined();
    });
    it("should start timer when started with start function", () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useHook());
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(result.current.currentValue).toBe(1);
      jest.useRealTimers();      
    });

    it("should start timer when started with start function in array destructuring", () => {
        jest.useFakeTimers();
        const { result } = renderHook(() => useHook());
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(result.current.currentValue).toBe(1);
        jest.useRealTimers();
      });
});