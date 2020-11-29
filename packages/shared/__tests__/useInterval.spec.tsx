/**
 * @jest-environment jsdom
 */
import { useState } from "react";
import {useInterval} from "../useInterval";
import { renderHook, cleanup } from "@testing-library/react-hooks";
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;

describe("useInterval", () => {
    let useHook;

    beforeEach(() => {
      useHook = function(){
        const [currentValue, setCurrentValue] = useState(0);
        function increment() {
          setCurrentValue(currentValue + 1);
        }
        const intervalHandler = useInterval(() => {
          increment();
        }, 1000);
        return {intervalHandler, currentValue}
      }
    });

    afterEach(cleanup);

    it("should be defined", () => {
      expect(useInterval).toBeDefined();
    });
    it("should start timer when started with start function", () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useHook());
      act(() => {
        result.current.intervalHandler.start();
      });
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
            const [start] = result.current.intervalHandler;
            start();
        });
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(result.current.currentValue).toBe(1);
        jest.useRealTimers();
      });

});