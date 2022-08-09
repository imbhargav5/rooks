/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useState } from "react";
import TestRenderer from "react-test-renderer";
import { useIntervalWhen } from "@/hooks/useIntervalWhen";

const { act } = TestRenderer;
type UseHook = (
  when: boolean,
  eager?: boolean
) => {
  currentValue: number;
};
describe("useIntervalWhen", () => {
  let useHook: UseHook = () => ({
    currentValue: 5,
  });

  const EAGER = true;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
    useHook = function (when: boolean, eager = false) {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }

      useIntervalWhen(
        () => {
          increment();
        },
        1_000,
        when,
        eager
      );

      return { currentValue };
    };
  });

  afterEach(() => {
    void cleanup();
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIntervalWhen).toBeDefined();
  });
  it("should start timer when started with start function", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook(true));
    void act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });

  it("should call the callback eagerly", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook(true, EAGER));
    // The value was already incremented because we use useIntervalWhen in EAGER mode
    expect(result.current.currentValue).toBe(1);
    void act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    // The value was incremented twice: one time by the setInterval and one time due to the EAGER
    expect(result.current.currentValue).toBe(2);
    jest.useRealTimers();
  });
});
