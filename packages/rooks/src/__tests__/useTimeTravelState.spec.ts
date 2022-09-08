/**
 * @jest-environment jsdom
 */
import { cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useTimeTravelState } from "@/hooks/useTimeTravelState";

const { act } = TestRenderer;

describe("useTimeTravelState", () => {
  afterEach(cleanup);
  let useHook = function (defaultValue: number) {
    const [value, setValue, controls] =
      useTimeTravelState<number>(defaultValue);
    function increment() {
      setValue((current) => (current || 0) + 1);
    }

    function incrementOverwrite() {
      setValue((current) => (current || 0) + 1, {
        overwriteLastEntry: true,
      });
    }

    return { increment, controls, value, incrementOverwrite };
  };

  beforeEach(() => {
    useHook = function (defaultValue: number) {
      const [value, setValue, controls] = useTimeTravelState(defaultValue);
      function increment() {
        setValue((current) => (current || 0) + 1);
      }

      function incrementOverwrite() {
        setValue((current) => (current || 0) + 1, {
          overwriteLastEntry: true,
        });
      }

      return { increment, controls, value, incrementOverwrite };
    };
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTimeTravelState).toBeDefined();
  });

  it("should honor default value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));
    expect(result.current.value).toBe(42);
  });

  it("should show latest value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(43);
  });

  it("should show previous value after undo", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
      result.current.increment();
      result.current.controls.back();
    });

    expect(result.current.value).toBe(43);
  });

  it("should show initial value after multiple undo", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.value).toBe(44);
    void act(() => {
      result.current.controls.back();
      result.current.controls.back();
      result.current.controls.back();
      result.current.controls.back();
      result.current.controls.back();
    });

    expect(result.current.value).toBe(42);
    expect(result.current.controls.canUndo).toBe(false);

    void act(() => {
      result.current.controls.forward();
    });
    expect(result.current.value).toBe(43);

    void act(() => {
      result.current.controls.forward();
    });
    expect(result.current.value).toBe(44);
    expect(result.current.controls.canRedo).toBe(false);
    void act(() => {
      result.current.controls.go(-1);
    });
    expect(result.current.value).toBe(43);

    void act(() => {
      result.current.controls.go(-1);
    });
    expect(result.current.value).toBe(42);
    void act(() => {
      result.current.controls.go(2);
    });
    expect(result.current.value).toBe(44);
  });

  it("should overwrite value if overwriteLastEntry is provided ", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.incrementOverwrite();
      result.current.incrementOverwrite();
    });

    expect(result.current.controls.canUndo).toBe(false);
    expect(result.current.controls.canRedo).toBe(false);
    expect(result.current.value).toBe(44);

    void act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.controls.canUndo).toBe(true);
    expect(result.current.value).toBe(46);
    void act(() => {
      result.current.incrementOverwrite();
      result.current.incrementOverwrite();
    });

    expect(result.current.value).toBe(48);
    expect(result.current.controls.canUndo).toBe(true);
    expect(result.current.controls.canRedo).toBe(false);
    void act(() => {
      result.current.controls.back();
    });
    expect(result.current.value).toBe(45);
    expect(result.current.controls.canUndo).toBe(true);
    expect(result.current.controls.canRedo).toBe(true);
    void act(() => {
      result.current.controls.forward();
    });
    expect(result.current.value).toBe(48);
  });
});
