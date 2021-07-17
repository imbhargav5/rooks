import { renderHook, act } from "@testing-library/react-hooks";
import { useFullscreen } from "../hooks/useFullscreen";

describe("useFullscreen", () => {
  it("should be defined", () => {
    expect(useFullscreen).toBeDefined();
  });
  it("should return an object", () => {
    const { result } = renderHook(() => useFullscreen());
    expect(typeof result.current).toBe("object");
  });
  it.only("should forward requestFullscreenOptions to requestFullscreen", () => {
    (document as any).exitFullscreen = jest.fn();
    const element = { requestFullscreen: jest.fn() };
    const mockRequestFullscreenOptions = { navigationUI: "show" };
    const { result } = renderHook(() =>
      useFullscreen({ requestFullscreenOptions: { navigationUI: "show" } })
    );
    act(() => {
      result.current?.request(element as any);
    });
    expect(element.requestFullscreen).toHaveBeenCalledWith(
      mockRequestFullscreenOptions
    );
  });
});
