import { act, renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { useTimeoutWhen } from "../hooks/useTimeoutWhen";

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
});
