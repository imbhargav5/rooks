import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";
import { useResponsive } from "@/hooks/useResponsive";
import type { Breakpoint } from "@/hooks/useResponsive";

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe("useResponsive", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useResponsive).toBeDefined();
  });

  it("should return an object with all required properties", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useResponsive());

    expect(result.current).toHaveProperty("breakpoint");
    expect(result.current).toHaveProperty("isXs");
    expect(result.current).toHaveProperty("isSm");
    expect(result.current).toHaveProperty("isMd");
    expect(result.current).toHaveProperty("isLg");
    expect(result.current).toHaveProperty("isXl");
    expect(result.current).toHaveProperty("isXxl");
    expect(result.current).toHaveProperty("width");
  });

  it("should have boolean values for all is* properties", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.isXs).toBe("boolean");
    expect(typeof result.current.isSm).toBe("boolean");
    expect(typeof result.current.isMd).toBe("boolean");
    expect(typeof result.current.isLg).toBe("boolean");
    expect(typeof result.current.isXl).toBe("boolean");
    expect(typeof result.current.isXxl).toBe("boolean");
  });

  it("should have exactly one is* flag set to true at any time", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useResponsive());
    const { isXs, isSm, isMd, isLg, isXl, isXxl } = result.current;
    const trueCount = [isXs, isSm, isMd, isLg, isXl, isXxl].filter(Boolean)
      .length;

    expect(trueCount).toBe(1);
  });

  it("should return a number for width", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.width).toBe("number");
  });

  describe("breakpoint detection", () => {
    it("should return xs breakpoint for width 0px (boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(0);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xs");
      expect(result.current.isXs).toBe(true);
      expect(result.current.isSm).toBe(false);
      expect(result.current.isMd).toBe(false);
      expect(result.current.isLg).toBe(false);
      expect(result.current.isXl).toBe(false);
      expect(result.current.isXxl).toBe(false);
      expect(result.current.width).toBe(0);
    });

    it("should return xs breakpoint for typical mobile width 375px", () => {
      expect.hasAssertions();
      setWindowWidth(375);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xs");
      expect(result.current.isXs).toBe(true);
      expect(result.current.width).toBe(375);
    });

    it("should return xs breakpoint for width 575px (just below sm boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(575);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xs");
      expect(result.current.isXs).toBe(true);
    });

    it("should return sm breakpoint at exactly 576px", () => {
      expect.hasAssertions();
      setWindowWidth(576);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("sm");
      expect(result.current.isXs).toBe(false);
      expect(result.current.isSm).toBe(true);
      expect(result.current.isMd).toBe(false);
      expect(result.current.isLg).toBe(false);
      expect(result.current.isXl).toBe(false);
      expect(result.current.isXxl).toBe(false);
      expect(result.current.width).toBe(576);
    });

    it("should return sm breakpoint for typical small tablet width 640px", () => {
      expect.hasAssertions();
      setWindowWidth(640);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("sm");
      expect(result.current.isSm).toBe(true);
    });

    it("should return sm breakpoint for width 767px (just below md boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(767);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("sm");
      expect(result.current.isSm).toBe(true);
    });

    it("should return md breakpoint at exactly 768px", () => {
      expect.hasAssertions();
      setWindowWidth(768);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("md");
      expect(result.current.isXs).toBe(false);
      expect(result.current.isSm).toBe(false);
      expect(result.current.isMd).toBe(true);
      expect(result.current.isLg).toBe(false);
      expect(result.current.isXl).toBe(false);
      expect(result.current.isXxl).toBe(false);
      expect(result.current.width).toBe(768);
    });

    it("should return md breakpoint for width 991px (just below lg boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(991);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("md");
      expect(result.current.isMd).toBe(true);
    });

    it("should return lg breakpoint at exactly 992px", () => {
      expect.hasAssertions();
      setWindowWidth(992);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("lg");
      expect(result.current.isXs).toBe(false);
      expect(result.current.isSm).toBe(false);
      expect(result.current.isMd).toBe(false);
      expect(result.current.isLg).toBe(true);
      expect(result.current.isXl).toBe(false);
      expect(result.current.isXxl).toBe(false);
      expect(result.current.width).toBe(992);
    });

    it("should return lg breakpoint for width 1199px (just below xl boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(1199);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("lg");
      expect(result.current.isLg).toBe(true);
    });

    it("should return xl breakpoint at exactly 1200px", () => {
      expect.hasAssertions();
      setWindowWidth(1200);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xl");
      expect(result.current.isXs).toBe(false);
      expect(result.current.isSm).toBe(false);
      expect(result.current.isMd).toBe(false);
      expect(result.current.isLg).toBe(false);
      expect(result.current.isXl).toBe(true);
      expect(result.current.isXxl).toBe(false);
      expect(result.current.width).toBe(1200);
    });

    it("should return xl breakpoint for width 1399px (just below xxl boundary)", () => {
      expect.hasAssertions();
      setWindowWidth(1399);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xl");
      expect(result.current.isXl).toBe(true);
    });

    it("should return xxl breakpoint at exactly 1400px", () => {
      expect.hasAssertions();
      setWindowWidth(1400);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xxl");
      expect(result.current.isXs).toBe(false);
      expect(result.current.isSm).toBe(false);
      expect(result.current.isMd).toBe(false);
      expect(result.current.isLg).toBe(false);
      expect(result.current.isXl).toBe(false);
      expect(result.current.isXxl).toBe(true);
      expect(result.current.width).toBe(1400);
    });

    it("should return xxl breakpoint for a very large width 2560px", () => {
      expect.hasAssertions();
      setWindowWidth(2560);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.breakpoint).toBe("xxl");
      expect(result.current.isXxl).toBe(true);
      expect(result.current.width).toBe(2560);
    });
  });

  describe("event listener lifecycle", () => {
    it("should add a resize event listener on mount", () => {
      expect.hasAssertions();
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderHook(() => useResponsive());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("should remove the resize event listener on unmount", () => {
      expect.hasAssertions();
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useResponsive());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });
  });

  describe("reactive updates on resize", () => {
    it("should update breakpoint when window is resized to a new breakpoint", () => {
      expect.hasAssertions();
      setWindowWidth(320);

      let resizeCallback: (() => void) | undefined;

      vi.spyOn(window, "addEventListener").mockImplementation(
        (event, callback) => {
          if (event === "resize") {
            resizeCallback = callback as () => void;
          }
        }
      );

      const { result } = renderHook(() => useResponsive());
      expect(result.current.breakpoint).toBe("xs");

      // Resize into md
      setWindowWidth(900);
      act(() => {
        resizeCallback?.();
      });

      expect(result.current.breakpoint).toBe("md");
      expect(result.current.isMd).toBe(true);
      expect(result.current.isXs).toBe(false);
      expect(result.current.width).toBe(900);
    });

    it("should transition through breakpoints correctly on sequential resizes", () => {
      expect.hasAssertions();
      setWindowWidth(320);

      let resizeCallback: (() => void) | undefined;

      vi.spyOn(window, "addEventListener").mockImplementation(
        (event, callback) => {
          if (event === "resize") {
            resizeCallback = callback as () => void;
          }
        }
      );

      const { result } = renderHook(() => useResponsive());
      expect(result.current.breakpoint).toBe("xs");

      const steps: Array<[number, Breakpoint]> = [
        [576, "sm"],
        [768, "md"],
        [992, "lg"],
        [1200, "xl"],
        [1400, "xxl"],
      ];

      for (const [width, expectedBreakpoint] of steps) {
        setWindowWidth(width);
        act(() => {
          resizeCallback?.();
        });
        expect(result.current.breakpoint).toBe(expectedBreakpoint);
        expect(result.current.width).toBe(width);
      }
    });

    it("should not change reference when resizing within the same breakpoint", () => {
      expect.hasAssertions();
      setWindowWidth(768);

      let resizeCallback: (() => void) | undefined;

      vi.spyOn(window, "addEventListener").mockImplementation(
        (event, callback) => {
          if (event === "resize") {
            resizeCallback = callback as () => void;
          }
        }
      );

      const { result } = renderHook(() => useResponsive());
      const firstSnapshot = result.current;

      // Resize within md range (768–991) — same breakpoint, same width → same reference
      setWindowWidth(768);
      act(() => {
        resizeCallback?.();
      });

      expect(result.current).toBe(firstSnapshot);
    });
  });

  describe("width accuracy", () => {
    it("should reflect the current window.innerWidth in the width property", () => {
      expect.hasAssertions();
      setWindowWidth(1024);
      const { result } = renderHook(() => useResponsive());

      expect(result.current.width).toBe(1024);
    });
  });
});
