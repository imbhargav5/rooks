import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";
import { useDocumentVisibilityState } from "@/hooks/useDocumentVisibilityState";

describe("useDocumentVisibilityState", () => {
  const originalVisibilityState = document.visibilityState;
  let visibilityChangeCallback: (() => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    visibilityChangeCallback = null;

    // Mock document.addEventListener to capture the callback
    vi.spyOn(document, 'addEventListener').mockImplementation((event, callback) => {
      if (event === 'visibilitychange') {
        visibilityChangeCallback = callback as () => void;
      }
    });

    vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();

    // Restore original visibility state
    Object.defineProperty(document, 'visibilityState', {
      value: originalVisibilityState,
      writable: true,
      configurable: true,
    });
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDocumentVisibilityState).toBeDefined();
  });

  it("should return current document visibility state", () => {
    expect.hasAssertions();

    // Mock visible state
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useDocumentVisibilityState());

    expect(result.current).toBe('visible');
  });

  it("should return 'hidden' when document is hidden", () => {
    expect.hasAssertions();

    // Mock hidden state
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useDocumentVisibilityState());

    expect(result.current).toBe('hidden');
  });

  it("should add event listener on mount", () => {
    expect.hasAssertions();

    renderHook(() => useDocumentVisibilityState());

    expect(document.addEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
  });

  it("should remove event listener on unmount", () => {
    expect.hasAssertions();

    const { unmount } = renderHook(() => useDocumentVisibilityState());

    unmount();

    expect(document.removeEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
  });

  it("should update when visibility state changes", () => {
    expect.hasAssertions();

    // Start with visible state
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useDocumentVisibilityState());

    // Initially visible
    expect(result.current).toBe('visible');

    // Change document visibility state to hidden
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    // Trigger the visibility change event
    act(() => {
      if (visibilityChangeCallback) {
        visibilityChangeCallback();
      }
    });

    expect(result.current).toBe('hidden');
  });

  it("should handle multiple visibility state transitions", () => {
    expect.hasAssertions();

    // Start with visible state
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useDocumentVisibilityState());

    // Initially visible
    expect(result.current).toBe('visible');

    // Change to hidden
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    act(() => {
      if (visibilityChangeCallback) {
        visibilityChangeCallback();
      }
    });
    expect(result.current).toBe('hidden');

    // Change back to visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
    act(() => {
      if (visibilityChangeCallback) {
        visibilityChangeCallback();
      }
    });
    expect(result.current).toBe('visible');
  });

  it("should work correctly when document is available", () => {
    expect.hasAssertions();

    // Mock prerender state if supported
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useDocumentVisibilityState());

    expect(result.current).toBe('visible');
    expect(document.addEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
  });
});
