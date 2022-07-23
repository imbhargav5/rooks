/**
 * @jest-environment jsdom
 */
import type { RenderResult } from "@testing-library/react-hooks";
import { act, renderHook } from "@testing-library/react-hooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should be defined", () => {
    expect(useDebouncedValue).toBeDefined();
  });

  it("should initialize with first value if timeout is not reached and initializeWithNull is false", () => {
    const mockValue = "mock_value";
    const { result } = renderHook(() => useDebouncedValue(mockValue, 200));

    act(() => {
      expect(result.current[0]).toBe(mockValue);
    });
  });

  it("should return null if the timeout has not been reached and initializeWithNull is true", () => {
    const mockValue = "mock_value";

    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, 200, { initializeWithNull: true })
    );

    act(() => {
      expect(result.current[0]).toBeNull();
    });
  });

  it("should returns updated value if the timeout has been reached and initializeWithNull is true", () => {
    const mockValue = "mock_value";
    let result;
    act(() => {
      const { result: resultFromHook } = renderHook(() =>
        useDebouncedValue(mockValue, 200, { initializeWithNull: true })
      );
      result = resultFromHook;
    });
    expect(
      (result as unknown as RenderResult<ReturnType<typeof useDebouncedValue>>)
        .current[0]
    ).toBeNull();
    act(() => {
      jest.runAllTimers();
    });
    expect(
      (result as unknown as RenderResult<ReturnType<typeof useDebouncedValue>>)
        .current[0]
    ).toBe(mockValue);
  });

  it("should respect the timeout value if initializedWithNull is true", () => {
    const mockValue = "mock_value";
    const mockTimeout = 200;

    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, mockTimeout, { initializeWithNull: true })
    );

    act(() => {
      jest.advanceTimersByTime(mockTimeout - 5);
    });
    expect(
      (result as unknown as RenderResult<ReturnType<typeof useDebouncedValue>>)
        .current[0]
    ).toBeNull();

    act(() => {
      // accounting for timing issues as it's not exactly accurate
      jest.advanceTimersByTime(5);
    });
    expect(result.current[0]).toBe(mockValue);
  });

  it.each([
    "string",
    2,
    ["mock_item_1", "mock_item_2"],
    { another_key: "another_value", key: "value" },
  ])("should work with different types of values", (mockValue) => {
    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, 200, { initializeWithNull: true })
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(result.current[0]).toBe(mockValue);
  });
});
