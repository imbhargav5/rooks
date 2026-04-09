import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useGlobalObjectEventListener } from "@/hooks/useGlobalObjectEventListener";

describe("useGlobalObjectEventListener", () => {
  it("attaches and removes a window listener when enabled", () => {
    expect.hasAssertions();
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const callback = vi.fn();

    const { unmount } = renderHook(() =>
      useGlobalObjectEventListener(window, "resize", callback)
    );

    expect(addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
      {}
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
      {}
    );
  });

  it("does not attach a listener when disabled", () => {
    expect.hasAssertions();
    const addEventListener = vi.spyOn(document, "addEventListener");
    const callback = vi.fn();

    renderHook(() =>
      useGlobalObjectEventListener(
        document,
        "visibilitychange",
        callback,
        {},
        false
      )
    );

    expect(addEventListener).not.toHaveBeenCalled();
  });
});
