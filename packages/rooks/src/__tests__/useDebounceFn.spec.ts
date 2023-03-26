import { useDebounceFn } from "@/hooks/useDebounceFn";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useDebounceFn", () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should call the debounced function only once after the delay when trailing is true", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { trailing: true })
    );

    act(() => {
      result.current[0]("test"); // Call the debounced function
    });

    expect(mockFn).toHaveBeenCalledTimes(0);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should call the debounced function immediately when leading is true", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { leading: true })
    );

    act(() => {
      result.current[0]("test"); // Call the debounced function
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should call the debounced function both on leading and trailing edges when both leading and trailing are true", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { leading: true, trailing: true })
    );

    act(() => {
      result.current[0]("test"); // Call the debounced function
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should not call the debounced function when delay is not reached", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { trailing: true })
    );

    act(() => {
      result.current[0]("test"); // Call the debounced function
    });

    act(() => {
      jest.advanceTimersByTime(delay - 50);
    });

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it("should call the debounced function with the latest arguments", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { trailing: true })
    );

    act(() => {
      result.current[0]("test1"); // Call the debounced function with 'test1'
      result.current[0]("test2"); // Call the debounced function with 'test2'
    });

    expect(mockFn).toHaveBeenCalledTimes(0);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test2");
  });

  it("should update isTimeoutEnabled correctly", () => {
    expect.hasAssertions();
    const mockFn = jest.fn();
    const delay = 200;

    const { result } = renderHook(() =>
      useDebounceFn(mockFn, delay, { trailing: true })
    );

    expect(result.current[1]).toBe(false);

    act(() => {
      result.current[0]("test"); // Call the debounced function
    });

    expect(result.current[1]).toBe(true);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(result.current[1]).toBe(false);
  });
});

describe("useDebounceFn with maxWait", () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should call the function after maxWait time for leading edge", () => {
    expect.hasAssertions();
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebounceFn(callback, 300, { leading: true, maxWait: 500 })
    );
    const [debouncedFn] = result.current;
    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      debouncedFn(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[1]).toBe(true);
    // runs immediately and sets timer
    act(() => {
      jest.advanceTimersByTime(450);
    });
    expect(result.current[1]).toBe(false);
    act(() => {
      debouncedFn(2);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(result.current[1]).toBe(true);
    // runs immediately since timer has been reset
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(result.current[1]).toBe(true);
    // this next call will be ignored since timer is already running
    act(() => {
      debouncedFn(3);
    });

    expect(result.current[1]).toBe(true);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, 1);
    expect(callback).toHaveBeenNthCalledWith(2, 2);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenNthCalledWith(2, 2);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      debouncedFn(4);
    });
    expect(callback).toHaveBeenNthCalledWith(3, 4);
  });

  it("should call the function after maxWait time for trailing edge", () => {
    expect.hasAssertions();
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebounceFn(callback, 300, { trailing: true, maxWait: 500 })
    );
    const [debouncedFn] = result.current;

    act(() => {
      debouncedFn(1);
    });
    expect(callback).toHaveBeenCalledTimes(0);
    expect(result.current[1]).toBe(true);
    act(() => {
      jest.advanceTimersByTime(450);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[1]).toBe(false);
    act(() => {
      debouncedFn(2);
    });
    act(() => {
      debouncedFn(3);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[1]).toBe(true);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[1]).toBe(true);
    act(() => {
      debouncedFn(4);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[1]).toBe(true);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current[1]).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, 1);
    expect(callback).toHaveBeenNthCalledWith(2, 4);
  });

  it("should call the function after maxWait time for both leading and trailing edges", () => {
    expect.hasAssertions();
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebounceFn(callback, 300, {
        leading: true,
        trailing: true,
        maxWait: 500,
      })
    );
    const [debouncedFn] = result.current;

    act(() => {
      debouncedFn(1);
    });
    act(() => {
      jest.advanceTimersByTime(450);
    });
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      debouncedFn(2);
    });
    expect(callback).toHaveBeenCalledTimes(3);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(3);

    act(() => {
      debouncedFn(3);
    });

    expect(callback).toHaveBeenCalledTimes(3);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenNthCalledWith(1, 1);
    expect(callback).toHaveBeenNthCalledWith(2, 1);
    expect(callback).toHaveBeenNthCalledWith(3, 2);
    expect(callback).toHaveBeenNthCalledWith(4, 3);
  });
});
