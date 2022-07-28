/**
 * @jest-environment node
 */
import { renderHook } from "@testing-library/react-hooks";
import { useLocalstorageState } from "../hooks/useLocalstorageState";
import { useOnline } from "../hooks/useOnline";

describe("when window is undefined", () => {
  let consoleSpy: unknown;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    (consoleSpy as jest.SpyInstance).mockClear();
  });

  it("useLocalstorageState logs warning", () => {
    renderHook(() => useLocalstorageState("test"));
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("useOnline logs warning", () => {
    renderHook(() => useOnline());
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
