/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { act } from "@testing-library/react";
import { useWindowSize } from "@/hooks/useWindowSize";

describe("useWindowSize", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWindowSize).toBeDefined();
  });

  it("should return window dimensions object with correct properties", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toHaveProperty('innerHeight');
    expect(result.current).toHaveProperty('innerWidth');
    expect(result.current).toHaveProperty('outerHeight');
    expect(result.current).toHaveProperty('outerWidth');
    expect(typeof result.current.innerHeight).toBe('number');
    expect(typeof result.current.innerWidth).toBe('number');
    expect(typeof result.current.outerHeight).toBe('number');
    expect(typeof result.current.outerWidth).toBe('number');
  });

  it("should add event listener on mount", () => {
    expect.hasAssertions();
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useWindowSize());

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it("should remove event listener on unmount", () => {
    expect.hasAssertions();
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it("should update when window resize event is triggered", () => {
    expect.hasAssertions();
    let resizeCallback: (() => void) | undefined;

    jest.spyOn(window, 'addEventListener').mockImplementation((event, callback) => {
      if (event === 'resize') {
        resizeCallback = callback as () => void;
      }
    });

    const { result } = renderHook(() => useWindowSize());
    const initialDimensions = result.current;

    // Verify we have initial dimensions
    expect(initialDimensions.innerWidth).toBeGreaterThan(0);
    expect(initialDimensions.innerHeight).toBeGreaterThan(0);

    // Trigger resize event
    act(() => {
      if (resizeCallback) {
        resizeCallback();
      }
    });

    // Hook should still return valid dimensions after resize
    expect(result.current.innerWidth).toBeGreaterThan(0);
    expect(result.current.innerHeight).toBeGreaterThan(0);
  });

  describe("basic", () => {
    it("should have an initial value on first render", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWindowSize());
      expect(result.current.innerHeight).not.toBeNull();
    });
  });
});
