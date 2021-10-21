/**
 * @jest-environment jsdom
 */
import { cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import TestRenderer from "react-test-renderer";
import { useConsole } from "../hooks/useConsole";

const { act } = TestRenderer;

const useHook = () => {
  const [value, setValue] = useState(0);

  useConsole("info", value);

  return { setValue, value };
};

const useInfoHook = () => {
  const [value, setValue] = useState(0);

  useConsole(value);

  return { setValue, value };
};

describe("useConsole", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useConsole).toBeDefined();
  });

  it("should log to console when value changes", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const { result } = renderHook(() => useInfoHook());

    expect(consoleSpy).toHaveBeenCalledWith(0);

    act(() => {
      result.current.setValue(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith(1);

    act(() => {
      result.current.setValue(1);
    });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("should use different underlying console method when level is provided", () => {
    const consoleSpy = jest.spyOn(console, "info");
    const { result } = renderHook(() => useHook());

    expect(consoleSpy).toHaveBeenCalledWith(0);

    act(() => {
      result.current.setValue(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith(1);

    act(() => {
      result.current.setValue(1);
    });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});
