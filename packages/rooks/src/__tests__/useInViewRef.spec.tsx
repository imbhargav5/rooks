import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInViewRef } from "@/hooks/useInViewRef";

describe("useInViewRef", () => {
  let mockIntersectionObserver: vi.Mock;
  let observerInstances: any[];

  beforeEach(() => {
    observerInstances = [];
    mockIntersectionObserver = vi.fn((callback, options) => {
      const instance = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        callback,
        options,
      };
      observerInstances.push(instance);
      return instance;
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it("should return initial inView value as false", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useInViewRef(() => {}));

    expect(result.current[1]).toBe(false);
  });

  it("should call IntersectionObserver with correct options", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: [0, 1],
    };

    const { result } = renderHook(() => useInViewRef(callback, options));

    act(() => {
      const div = document.createElement("div");
      result.current[0](div);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it("should update inView value when the element enters or leaves the viewport", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useInViewRef(callback));

    act(() => {
      const div = document.createElement("div");
      result.current[0](div);
    });

    act(() => {
      const observerInstance = observerInstances[0];
      const entry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
      };
      const entries: IntersectionObserverEntry[] = [
        entry as IntersectionObserverEntry,
      ];

      observerInstance.callback(entries, observerInstance);
    });

    expect(result.current[1]).toBe(true);

    act(() => {
      const observerInstance = observerInstances[0];
      const entry: Partial<IntersectionObserverEntry> = {
        isIntersecting: false,
      };
      const entries: IntersectionObserverEntry[] = [
        entry as IntersectionObserverEntry,
      ];

      observerInstance.callback(entries, observerInstance);
    });

    expect(result.current[1]).toBe(false);
  });

  it("should call the provided callback when the element enters or leaves the viewport", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useInViewRef(callback));

    act(() => {
      const div = document.createElement("div");
      result.current[0](div);
    });
    act(() => {
      const observerInstance = observerInstances[0];
      const entry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
      };
      const entries: IntersectionObserverEntry[] = [
        entry as IntersectionObserverEntry,
      ];

      observerInstance.callback(entries, observerInstance);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should work with no arguments", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useInViewRef());

    expect(result.current[1]).toBe(false);
  });

  it("should work with options as the only argument", () => {
    expect.hasAssertions();
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: [0, 1],
    };

    const { result } = renderHook(() => useInViewRef(options));

    act(() => {
      const div = document.createElement("div");
      result.current[0](div);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it("should work with both callback and options as arguments", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: [0, 1],
    };

    const { result } = renderHook(() => useInViewRef(callback, options));

    act(() => {
      const div = document.createElement("div");
      result.current[0](div);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });
});
