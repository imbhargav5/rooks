/**
 * @jest-environment node
 */
import { renderHook } from "@testing-library/react-hooks";
import { useOnWindowResize } from "../hooks/useOnWindowResize";
import { useOnWindowScroll } from "../hooks/useOnWindowScroll";
import { useIntervalWhen } from "../hooks/useIntervalWhen";
import { useFullscreen } from "../hooks/useFullscreen";
import { useLocalstorage } from "../hooks/useLocalstorage";
import { useLocalstorageState } from "../hooks/useLocalstorageState";
import { useOnline } from "../hooks/useOnline";
import { useSessionstorage } from "../hooks/useSessionstorage";
import { useThrottle } from "../hooks/useThrottle";

describe("when window is undefined", () => {
  const mockCallback = jest.fn(() => {});
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it("useOnWindowResize logs warning", () => {
    renderHook(() => useOnWindowResize(mockCallback));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useOnWindowScroll logs warning", () => {
    renderHook(() => useOnWindowScroll(mockCallback));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useIntervalWhen logs warning", () => {
    renderHook(() => useIntervalWhen(mockCallback));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useFullscreen logs warning", () => {
    renderHook(() => useFullscreen());
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useLocalstorage logs warning", () => {
    renderHook(() => useLocalstorage("test"));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useLocalstorageState logs warning", () => {
    renderHook(() => useLocalstorageState("test"));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useOnline logs warning", () => {
    renderHook(() => useOnline());
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useSessionstorage logs warning", () => {
    renderHook(() => useSessionstorage("test"));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("useThrottle logs warning", () => {
    renderHook(() => useThrottle(mockCallback));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
