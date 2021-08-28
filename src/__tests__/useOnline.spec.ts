/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react-hooks";
import { useOnline } from "../hooks/useOnline";

describe("useOnline", () => {
  it("is defined", () => {
    expect(useOnline).toBeDefined();
  });

  it("detects online status change", async () => {
    const onLineSpy = jest.spyOn(window.navigator, "onLine", "get");

    // Pretend we're initially online:
    onLineSpy.mockReturnValue(true);

    const { result, waitForNextUpdate } = renderHook(() => useOnline());

    await act(async () => {
      const goOffline = new window.Event("offline");

      // Pretend we're offline:
      onLineSpy.mockReturnValue(false);

      window.dispatchEvent(goOffline);

      await waitForNextUpdate();
    });

    expect(result.current).toBe(false);
  });
});
