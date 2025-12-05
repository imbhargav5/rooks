import { vi } from "vitest";
import type { RenderResult } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type Expect<T extends true> = T;

const doNotExecute = (_func: () => void) => true;

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDebouncedValue).toBeDefined();
  });

  it("should initialize with first value if timeout is not reached and initializeWithNull is false", () => {
    expect.hasAssertions();
    const mockValue = "mock_value";
    const { result } = renderHook(() => useDebouncedValue(mockValue, 200));

    act(() => {
      expect(result.current[0]).toBe(mockValue);
    });
  });

  it("should return null if the timeout has not been reached and initializeWithNull is true", () => {
    expect.hasAssertions();
    const mockValue = "mock_value";

    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, 200, { initializeWithNull: true })
    );

    act(() => {
      expect(result.current[0]).toBeNull();
    });
  });

  it("should returns updated value if the timeout has been reached and initializeWithNull is true", () => {
    expect.hasAssertions();
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
      vi.runAllTimers();
    });
    expect(
      (result as unknown as RenderResult<ReturnType<typeof useDebouncedValue>>)
        .current[0]
    ).toBe(mockValue);
  });

  it("should respect the timeout value if initializedWithNull is true", () => {
    expect.hasAssertions();
    const mockValue = "mock_value";
    const mockTimeout = 200;

    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, mockTimeout, { initializeWithNull: true })
    );

    act(() => {
      vi.advanceTimersByTime(mockTimeout - 5);
    });
    expect(
      (result as unknown as RenderResult<ReturnType<typeof useDebouncedValue>>)
        .current[0]
    ).toBeNull();

    act(() => {
      // accounting for timing issues as it's not exactly accurate
      vi.advanceTimersByTime(5);
    });
    expect(result.current[0]).toBe(mockValue);
  });

  it.each([
    "string",
    2,
    ["mock_item_1", "mock_item_2"],
    { another_key: "another_value", key: "value" },
  ])("should work with different types of values", (mockValue) => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useDebouncedValue(mockValue, 200, { initializeWithNull: true })
    );

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current[0]).toBe(mockValue);
  });

  describe("types", () => {
    it("should return a union with null when initializeWithNull is true", () => {
      doNotExecute(() => {
        const hookResult = renderHook(() =>
          useDebouncedValue("mock_value", 200, { initializeWithNull: true })
        );
        const result: Expect<
          Equal<string | null, typeof hookResult.result.current[0]>
        > = true;
        return result;
      });
    });

    it("should not return a union with null per default", () => {
      doNotExecute(() => {
        const hookResult = renderHook(() =>
          useDebouncedValue("mock_value", 200)
        );
        const result: Expect<
          Equal<string, typeof hookResult.result.current[0]>
        > = true;
        return result;
      });
    });

    it("should not return a union with null when initializeWithNull is false", () => {
      doNotExecute(() => {
        const hookResult = renderHook(() =>
          useDebouncedValue("mock_value", 200, { initializeWithNull: false })
        );
        const result: Expect<
          Equal<string, typeof hookResult.result.current[0]>
        > = true;
        return result;
      });
    });
  });
});
