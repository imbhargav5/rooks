import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";
import { useScroll } from "@/hooks/useScroll";
import { renderHook } from "@testing-library/react";

// ─── Helper component ──────────────────────────────────────────────────────────

function ScrollableComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const [{ left, top }, isScrolling] = useScroll(ref);
  return (
    <div
      ref={ref}
      data-testid="scrollable"
      style={{ overflow: "auto", height: 100 }}
    >
      <div data-testid="left">{left}</div>
      <div data-testid="top">{top}</div>
      <div data-testid="scrolling">{String(isScrolling)}</div>
      <div style={{ height: 1000, width: 1000 }} />
    </div>
  );
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("useScroll", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useScroll).toBeDefined();
  });

  // ── initial state ──────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("returns { left: 0, top: 0 } and isScrolling=false when target is null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useScroll(null));
      const [scrollPosition, isScrolling] = result.current;
      expect(scrollPosition).toEqual({ left: 0, top: 0 });
      expect(isScrolling).toBe(false);
    });

    it("starts with zero scroll position and isScrolling false after mount", () => {
      expect.hasAssertions();
      render(<ScrollableComponent />);
      expect(screen.getByTestId("left")).toHaveTextContent("0");
      expect(screen.getByTestId("top")).toHaveTextContent("0");
      expect(screen.getByTestId("scrolling")).toHaveTextContent("false");
    });
  });

  // ── scroll position updates ────────────────────────────────────────────────

  describe("scroll position tracking", () => {
    it("updates scroll position on scroll event", () => {
      expect.hasAssertions();
      render(<ScrollableComponent />);
      const el = screen.getByTestId("scrollable");

      Object.defineProperty(el, "scrollLeft", {
        value: 50,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(el, "scrollTop", {
        value: 120,
        writable: true,
        configurable: true,
      });

      act(() => {
        fireEvent.scroll(el);
      });

      expect(screen.getByTestId("left")).toHaveTextContent("50");
      expect(screen.getByTestId("top")).toHaveTextContent("120");
    });

    it("sets isScrolling to true immediately on scroll", () => {
      expect.hasAssertions();
      vi.useFakeTimers();
      try {
        render(<ScrollableComponent />);
        const el = screen.getByTestId("scrollable");

        act(() => {
          fireEvent.scroll(el);
        });

        expect(screen.getByTestId("scrolling")).toHaveTextContent("true");
      } finally {
        vi.useRealTimers();
      }
    });
  });

  // ── debounce / isScrolling reset ───────────────────────────────────────────

  describe("isScrolling debounce", () => {
    it("resets isScrolling to false after 100ms with no further scroll events", () => {
      expect.hasAssertions();
      vi.useFakeTimers();
      try {
        render(<ScrollableComponent />);
        const el = screen.getByTestId("scrollable");

        act(() => {
          fireEvent.scroll(el);
        });
        expect(screen.getByTestId("scrolling")).toHaveTextContent("true");

        act(() => {
          vi.advanceTimersByTime(100);
        });

        expect(screen.getByTestId("scrolling")).toHaveTextContent("false");
      } finally {
        vi.useRealTimers();
      }
    });

    it("debounce resets on every new scroll, so isScrolling stays true across rapid scrolls", () => {
      expect.hasAssertions();
      vi.useFakeTimers();
      try {
        render(<ScrollableComponent />);
        const el = screen.getByTestId("scrollable");

        act(() => {
          fireEvent.scroll(el);
        });
        act(() => {
          vi.advanceTimersByTime(50);
        });
        act(() => {
          fireEvent.scroll(el);
        });

        // 50 ms after the second scroll — still scrolling
        act(() => {
          vi.advanceTimersByTime(50);
        });
        expect(screen.getByTestId("scrolling")).toHaveTextContent("true");

        // Full 100 ms after the second scroll — now idle
        act(() => {
          vi.advanceTimersByTime(50);
        });
        expect(screen.getByTestId("scrolling")).toHaveTextContent("false");
      } finally {
        vi.useRealTimers();
      }
    });
  });

  // ── direct HTMLElement target ──────────────────────────────────────────────

  describe("with a direct HTMLElement", () => {
    it("attaches a scroll listener and reads the element's scroll offsets", () => {
      expect.hasAssertions();
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollLeft", {
        value: 30,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(div, "scrollTop", {
        value: 60,
        writable: true,
        configurable: true,
      });
      document.body.appendChild(div);

      const { result } = renderHook(() => useScroll(div));

      act(() => {
        fireEvent.scroll(div);
      });

      const [pos] = result.current;
      expect(pos.left).toBe(30);
      expect(pos.top).toBe(60);

      document.body.removeChild(div);
    });
  });

  // ── getter function target ─────────────────────────────────────────────────

  describe("with a getter function", () => {
    it("calls the getter and tracks the returned element", () => {
      expect.hasAssertions();
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollLeft", {
        value: 10,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(div, "scrollTop", {
        value: 20,
        writable: true,
        configurable: true,
      });
      document.body.appendChild(div);

      const getter = () => div;
      const { result } = renderHook(() => useScroll(getter));

      act(() => {
        fireEvent.scroll(div);
      });

      const [pos] = result.current;
      expect(pos.left).toBe(10);
      expect(pos.top).toBe(20);

      document.body.removeChild(div);
    });
  });

  // ── cleanup ────────────────────────────────────────────────────────────────

  describe("cleanup", () => {
    it("removes the event listener on unmount", () => {
      expect.hasAssertions();
      const div = document.createElement("div");
      const addSpy = vi.spyOn(div, "addEventListener");
      const removeSpy = vi.spyOn(div, "removeEventListener");
      document.body.appendChild(div);

      const { unmount } = renderHook(() => useScroll(div));
      expect(addSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        { passive: true }
      );

      unmount();
      expect(removeSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function)
      );

      document.body.removeChild(div);
    });
  });
});
