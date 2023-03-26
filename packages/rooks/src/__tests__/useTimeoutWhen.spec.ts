import { act, renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { useTimeoutWhen } from "@/hooks/useTimeoutWhen";

describe("useTimeoutWhen", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTimeoutWhen).toBeDefined();
  });
});

describe("base", () => {
  let useHook = () => ({ value: 5 });
  beforeEach(() => {
    useHook = function () {
      const [value, setValue] = useState(0);
      useTimeoutWhen(() => {
        setValue(9_000);
      }, 1_000);

      return { value };
    };
  });
  it("runs immediately after mount", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(9_000);
    jest.useRealTimers();
  });
  it("should not start the timeout when the condition is false", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result } = renderHook(() => {
      const [value, setValue] = useState(0);
      useTimeoutWhen(
        () => {
          setValue(9_000);
        },
        1_000,
        false
      );
      return { value };
    });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(0);
    jest.useRealTimers();
  });
  it("should cancel the timeout when the condition becomes false", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ when }) => {
        const [value, setValue] = useState(0);
        useTimeoutWhen(
          () => {
            setValue(9_000);
          },
          1_000,
          when
        );
        return { value };
      },
      { initialProps: { when: true } }
    );
    rerender({ when: false });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(0);
    jest.useRealTimers();
  });
  it("should start the timeout only when the condition becomes true", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ when }) => {
        const [value, setValue] = useState(0);
        useTimeoutWhen(
          () => {
            setValue(9_000);
          },
          1_000,
          when
        );
        return { value };
      },
      { initialProps: { when: false } }
    );
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(0);
    rerender({ when: true });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(9_000);
    jest.useRealTimers();
  });

  it("should reset the timeout when key changes", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ key }) => {
        const [value, setValue] = useState(0);
        useTimeoutWhen(
          () => {
            setValue((v) => v + 9000);
          },
          1_000,
          true,
          key
        );
        return { value };
      },
      { initialProps: { key: 1 } }
    );
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(9_000);
    rerender({ key: 2 });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(18_000);
    rerender({ key: 2 });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(18_000);
    rerender({ key: 9 });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(27_000);
    jest.useRealTimers();
  });

  it("should properly clean up callbacks and not call them if key changes", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ key }) => {
        useTimeoutWhen(callback, 1_000, true, key);
      },
      { initialProps: { key: 1 } }
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    rerender({ key: 2 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it("should not call the last callback and call the new callback when key changes", () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { rerender } = renderHook(
      ({ key, callback }) => {
        useTimeoutWhen(callback, 1_000, true, key);
      },
      { initialProps: { key: 1, callback: callback1 } }
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    rerender({ key: 2, callback: callback2 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
