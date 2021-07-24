import { renderHook, act } from "@testing-library/react-hooks";
import { useFullscreen } from "../hooks/useFullscreen";

describe("useFullscreen", () => {
  it("should forward requestFullscreenOptions to requestFullscreen", () => {
    document.exitFullscreen = jest.fn();
    const element = { requestFullscreen: jest.fn() };
    const mockRequestFullscreenOptions = { navigationUI: "show" };
    const { result } = renderHook(() =>
      useFullscreen({ requestFullscreenOptions: { navigationUI: "show" } })
    );
    expect(typeof result.current).toBe("object");
    act(() => {
      result.current?.request(element as any);
    });
    expect(element.requestFullscreen).toHaveBeenCalledWith(
      mockRequestFullscreenOptions
    );
  });
});
