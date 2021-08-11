/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react-hooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

jest.useFakeTimers();

describe("useDebouncedValue", () => {
  it("should be defined", () => {
    expect(useDebouncedValue).toBeDefined();
  });

  it("should return null if the timeout has not been reached", () => {
    const mockValue = "mock_value";

    const { result } = renderHook(() => useDebouncedValue(mockValue, 200));

    act(() => {
      expect(result.current).toBeNull();
    });
  });

  it("should returns updated value if the timeout has been reached", () => {
    const mockValue = "mock_value";

    const { result } = renderHook(() => useDebouncedValue(mockValue, 200));

    act(() => {
      jest.runAllTimers();
      expect(result.current).toBe(mockValue);
    });
  });

  it("should respect the timeout value", () => {
    const mockValue = "mock_value";
    const mockTimeout = 200;

    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, mockTimeout)
    );

    act(() => {
      jest.advanceTimersByTime(mockTimeout - 1);
      expect(result.current).toBe(null);
    });

    act(() => {
      jest.advanceTimersByTime(1);
      expect(result.current).toBe(mockValue);
    });
  });

  it.each([
    "string",
    2,
    ["mock_item_1", "mock_item_2"],
    { another_key: "another_value", key: "value" },
  ])("should work with different types of values", (mockValue) => {
    const { result } = renderHook(() => useDebouncedValue(mockValue, 200));

    act(() => {
      jest.runAllTimers();
      expect(result.current).toBe(mockValue);
    });
  });
});
