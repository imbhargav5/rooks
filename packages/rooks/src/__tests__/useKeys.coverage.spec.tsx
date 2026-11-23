import { renderHook, act } from "@testing-library/react";
import { useKeys } from "@/hooks/useKeys";

const press = (target: EventTarget, key: string, type = "keydown") =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
  });

describe("useKeys coverage", () => {
  it("fires once all keys are pressed and resets pressed key when not continuous", () => {
    const cb = vi.fn();
    const keys = ["a", "b"];
    renderHook(() => useKeys(keys, cb));
    press(document, "a");
    expect(cb).not.toHaveBeenCalled();
    press(document, "b");
    expect(cb).toHaveBeenCalledTimes(1);
    // only the last-pressed key is reset, so "a" is still held
    press(document, "b");
    expect(cb).toHaveBeenCalledTimes(2);
    press(document, "a", "keyup");
    press(document, "b");
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("fires repeatedly in continuous mode", () => {
    const cb = vi.fn();
    const keys = ["a", "b"];
    renderHook(() => useKeys(keys, cb, { continuous: true }));
    press(document, "a");
    press(document, "b");
    press(document, "b");
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("listens on a target element and uses the latest callback", () => {
    const el = document.createElement("div");
    const target = { current: el };
    const first = vi.fn();
    const second = vi.fn();
    const keys = ["x"];
    const { rerender } = renderHook(({ cb }) => useKeys(keys, cb, { target }), {
      initialProps: { cb: first },
    });
    rerender({ cb: second });
    press(document, "x");
    expect(second).not.toHaveBeenCalled();
    press(el, "x");
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes listeners when `when` is false or on unmount", () => {
    const cb = vi.fn();
    const keys = ["a"];
    const { rerender, unmount } = renderHook(
      ({ when }) => useKeys(keys, cb, { when }),
      { initialProps: { when: false } }
    );
    press(document, "a");
    expect(cb).not.toHaveBeenCalled();
    rerender({ when: true });
    press(document, "a");
    expect(cb).toHaveBeenCalledTimes(1);
    unmount();
    press(document, "a");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  describe("preventLostKeyup", () => {
    const originals = {
      alert: window.alert,
      confirm: window.confirm,
      prompt: window.prompt,
    };
    afterEach(() => {
      window.alert = originals.alert;
      window.confirm = originals.confirm;
      window.prompt = originals.prompt;
    });

    it("clears pressed keys when dialogs open and restores originals on unmount", () => {
      const alertSpy = vi.fn();
      const confirmSpy = vi.fn(() => true);
      const promptSpy = vi.fn(() => "v");
      window.alert = alertSpy;
      window.confirm = confirmSpy;
      window.prompt = promptSpy;

      const cb = vi.fn();
      const keys = ["a", "b"];
      const { unmount } = renderHook(() =>
        useKeys(keys, cb, { preventLostKeyup: true })
      );

      press(document, "a");
      window.alert("hi");
      expect(alertSpy).toHaveBeenCalledWith("hi");
      press(document, "b");
      expect(cb).not.toHaveBeenCalled();
      press(document, "b", "keyup");

      press(document, "a");
      expect(window.confirm("ok?")).toBe(true);
      press(document, "b");
      expect(cb).not.toHaveBeenCalled();
      press(document, "b", "keyup");

      press(document, "a");
      expect(window.prompt("p", "d")).toBe("v");
      expect(promptSpy).toHaveBeenCalledWith("p", "d");
      press(document, "b");
      expect(cb).not.toHaveBeenCalled();

      unmount();
      expect(window.alert).toBe(alertSpy);
      expect(window.confirm).toBe(confirmSpy);
      expect(window.prompt).toBe(promptSpy);
    });
  });
});
