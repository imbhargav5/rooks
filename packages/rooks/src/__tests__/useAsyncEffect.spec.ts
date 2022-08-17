/**
 * @jest-environment jsdom
 */
import { waitFor, renderHook } from "@testing-library/react";
import { useState } from "react";
import { act } from "react-test-renderer";
import { useAsyncEffect } from "@/hooks/useAsyncEffect";

describe("useAsyncEffect", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useAsyncEffect).toBeDefined();
  });

  it("runs the callback", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { result } = renderHook(() => {
      const [value, setValue] = useState(false);

      useAsyncEffect(async () => {
        setTimeout(() => {
          setValue(true);
        }, 100);
      }, []);

      return value;
    });

    expect(result.current).toBe(false);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("runs the callback only once per deps change", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const effectSpy = jest.fn();
    const { result, unmount } = renderHook(() => {
      const [value, setValue] = useState(false);
      const [unrelatedDep, setUnrelatedDep] = useState(1);

      useAsyncEffect(async () => {
        effectSpy();
        setTimeout(() => {
          setValue(true);
        }, 100);
      }, []);

      const increment = () => {
        setUnrelatedDep(unrelatedDep + 1);
      };

      return [value, unrelatedDep, increment];
    });

    expect(result.current[0]).toBe(false);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
    act(() => {
      const increment = result.current[2];
      typeof increment === "function" && increment();
    });
    await waitFor(() => {
      expect(result.current[1]).toBe(2);
    });
    unmount();
    expect(effectSpy).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("runs the callback again if deps change", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const effectSpy = jest.fn();
    const { result, unmount } = renderHook(() => {
      const [value, setValue] = useState(1);
      const [squareValue, setSquareValue] = useState<number>(0);
      const [unrelatedDep, setUnrelatedDep] = useState(1);

      useAsyncEffect(async () => {
        effectSpy();
        setTimeout(() => {
          setSquareValue(value * value);
        }, 100);
      }, [value]);

      const increment = () => {
        setValue(value + 1);
      };

      const incrementUnrelated = () => {
        setUnrelatedDep(unrelatedDep + 1);
      };

      return {
        value,
        increment,
        squareValue,
        unrelatedDep,
        incrementUnrelated,
      };
    });

    expect(result.current.value).toBe(1);
    expect(result.current.squareValue).toBe(0);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(result.current.squareValue).toBe(1);
    });
    act(() => {
      const increment = result.current.increment;
      typeof increment === "function" && increment();
    });
    expect(result.current.value).toBe(2);
    expect(result.current.squareValue).toBe(1);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(result.current.squareValue).toBe(4);
    });
    act(() => {
      const incrementUnrelated = result.current.incrementUnrelated;
      typeof incrementUnrelated === "function" && incrementUnrelated();
    });
    expect(effectSpy).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("runs the cleanup function", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [cleanupRan, setCleanupRan] = useState(false);
      const [forceUnload, setForceUnload] = useState(0);

      useAsyncEffect(
        async () => {},
        [forceUnload],
        () => setCleanupRan(true)
      );

      return { cleanupRan, forceUnload, setForceUnload };
    });

    expect(result.current.cleanupRan).toBe(false);

    act(() => {
      result.current.setForceUnload((old) => old + 1);
    });

    await waitFor(() => expect(result.current.cleanupRan).toBe(true));
  });

  it("it can help destroy the effect if the component unmounts", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const cleanupFn = jest.fn();
    const { result, unmount } = renderHook(() => {
      const [data, setData] = useState(0);
      useAsyncEffect(
        async (shouldContinueEffect) => {
          const promiseResult = await new Promise<number>((resolve) => {
            setTimeout(() => {
              resolve(5);
            }, 3000);
          });
          if (shouldContinueEffect()) {
            setData(promiseResult);
          }
        },
        [],
        (promiseResult) => cleanupFn(promiseResult)
      );

      return { data };
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    unmount();

    expect(result.current.data).toBe(0);
    expect(cleanupFn).toHaveBeenCalledWith(undefined);
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("it calls the cleanup with the previous result when effect changes ", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const cleanupFn = jest.fn();
    const { result } = renderHook(() => {
      const [input, setInput] = useState(1);
      const [output, setOutput] = useState<number>(0);
      useAsyncEffect(
        async (shouldContinueEffect): Promise<number> => {
          const promiseResult = await new Promise<number>((resolve) => {
            setTimeout(() => {
              resolve(input * input);
            }, 3000);
          });
          if (shouldContinueEffect()) {
            setOutput(promiseResult);
          }
          return promiseResult;
        },
        [input],
        cleanupFn
      );

      return { input, setInput, output };
    });

    expect(result.current.input).toBe(1);
    expect(result.current.output).toBe(0);
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => expect(result.current.input).toBe(1));
    await waitFor(() => expect(result.current.output).toBe(1));
    act(() => {
      result.current.setInput(2);
    });
    await waitFor(() => expect(cleanupFn).toHaveBeenCalledWith(1));
    await waitFor(() => expect(result.current.input).toBe(2));
    await waitFor(() => expect(result.current.output).toBe(1));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => expect(result.current.output).toBe(4));
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("it forwards if the effect errors out ", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const ERROR_MESSAGE = "an error occurred";
    const cleanupFn = jest.fn();
    const { result } = renderHook(() => {
      const [input] = useState(1);
      const [error, setError] = useState(null);
      useAsyncEffect(
        async (): Promise<number | undefined> => {
          try {
            return await new Promise<number>((_resolve, reject) => {
              setTimeout(() => {
                reject(new Error(ERROR_MESSAGE));
              }, 3000);
            });
          } catch (err) {
            setError(err);
          }
          return undefined;
        },
        [input, setError],
        cleanupFn
      );

      return { error };
    });

    expect(result.current.error).toBe(null);
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    await waitFor(() =>
      expect((result.current.error as unknown as Error).message).toBe(
        ERROR_MESSAGE
      )
    );
    jest.useRealTimers();
    jest.clearAllMocks();
  });
});
