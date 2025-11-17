/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { usePageLeave } from "@/hooks/usePageLeave";

describe("usePageLeave", () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(usePageLeave).toBeDefined();
  });

  it("should register event listeners on mount", () => {
    expect.hasAssertions();
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const documentAddEventListenerSpy = jest.spyOn(
      document,
      "addEventListener"
    );

    renderHook(() => usePageLeave(mockCallback));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "pagehide",
      expect.any(Function)
    );
  });

  it("should remove event listeners on unmount", () => {
    expect.hasAssertions();
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const documentRemoveEventListenerSpy = jest.spyOn(
      document,
      "removeEventListener"
    );

    const { unmount } = renderHook(() => usePageLeave(mockCallback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "pagehide",
      expect.any(Function)
    );
  });

  it("should call callback on beforeunload", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    const event = new Event("beforeunload") as BeforeUnloadEvent;
    window.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalled();
  });

  it("should call callback on visibilitychange when hidden", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    Object.defineProperty(document, "visibilityState", {
      writable: true,
      configurable: true,
      value: "hidden",
    });

    const event = new Event("visibilitychange");
    document.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalled();
  });

  it("should not call callback on visibilitychange when visible", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    Object.defineProperty(document, "visibilityState", {
      writable: true,
      configurable: true,
      value: "visible",
    });

    const event = new Event("visibilitychange");
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should call callback on pagehide", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    const event = new Event("pagehide");
    window.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalled();
  });

  it("should return confirmation message from callback", () => {
    expect.hasAssertions();
    const callbackWithMessage = jest.fn(() => "Are you sure you want to leave?");

    renderHook(() => usePageLeave(callbackWithMessage));

    const event = new Event("beforeunload") as BeforeUnloadEvent;
    event.preventDefault = jest.fn();

    window.dispatchEvent(event);

    expect(callbackWithMessage).toHaveBeenCalled();
    expect(event.returnValue).toBe("Are you sure you want to leave?");
  });

  it("should not set returnValue if callback returns undefined", () => {
    expect.hasAssertions();
    const callbackWithoutMessage = jest.fn(() => undefined);

    renderHook(() => usePageLeave(callbackWithoutMessage));

    const event = new Event("beforeunload") as BeforeUnloadEvent;
    event.preventDefault = jest.fn();

    window.dispatchEvent(event);

    expect(callbackWithoutMessage).toHaveBeenCalled();
    expect(event.returnValue).toBe("");
  });

  it("should not call callback multiple times on beforeunload and visibilitychange", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    // Trigger beforeunload
    const beforeUnloadEvent = new Event("beforeunload") as BeforeUnloadEvent;
    window.dispatchEvent(beforeUnloadEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Now trigger visibilitychange
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      writable: true,
      configurable: true,
    });
    const visibilityEvent = new Event("visibilitychange");
    document.dispatchEvent(visibilityEvent);

    // Should not be called again because beforeunload was already triggered
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback multiple times on beforeunload and pagehide", () => {
    expect.hasAssertions();
    renderHook(() => usePageLeave(mockCallback));

    // Trigger beforeunload
    const beforeUnloadEvent = new Event("beforeunload") as BeforeUnloadEvent;
    window.dispatchEvent(beforeUnloadEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Now trigger pagehide
    const pagehideEvent = new Event("pagehide");
    window.dispatchEvent(pagehideEvent);

    // Should not be called again because beforeunload was already triggered
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should use fresh callback reference", () => {
    expect.hasAssertions();
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();

    const { rerender } = renderHook(
      ({ callback }) => usePageLeave(callback),
      { initialProps: { callback: firstCallback } }
    );

    const event = new Event("pagehide");
    window.dispatchEvent(event);

    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).not.toHaveBeenCalled();

    // Update callback
    rerender({ callback: secondCallback });

    // Trigger event again
    const event2 = new Event("beforeunload") as BeforeUnloadEvent;
    window.dispatchEvent(event2);

    // New callback should be called, old one should not be called again
    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("should handle callback that returns void", () => {
    expect.hasAssertions();
    const voidCallback = jest.fn(() => {});

    renderHook(() => usePageLeave(voidCallback));

    const event = new Event("beforeunload") as BeforeUnloadEvent;
    window.dispatchEvent(event);

    expect(voidCallback).toHaveBeenCalled();
    expect(event.returnValue).toBe("");
  });
});
