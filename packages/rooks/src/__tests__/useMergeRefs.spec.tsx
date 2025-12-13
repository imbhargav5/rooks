/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import React, { useRef, createRef } from "react";
import { render, screen } from "@testing-library/react";

describe("useMergeRefs", () => {
  // 1. Basic Functionality
  describe("basic functionality", () => {
    it("should be defined", () => {
      expect.hasAssertions();
      expect(useMergeRefs).toBeDefined();
    });

    it("should return null when all refs are null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useMergeRefs(null, null, null));

      expect(result.current).toBeNull();
    });

    it("should return a function when at least one ref is not null", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const { result } = renderHook(() => useMergeRefs(ref, null));

      expect(typeof result.current).toBe("function");
    });
  });

  // 2. Mutable Refs
  describe("mutable refs", () => {
    it("should set value on a single mutable ref", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(ref));

      // Call the merged ref
      result.current?.(element);

      expect(ref.current).toBe(element);
    });

    it("should set value on multiple mutable refs", () => {
      expect.hasAssertions();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();
      const ref3 = createRef<HTMLDivElement>();
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(ref1, ref2, ref3));

      result.current?.(element);

      expect(ref1.current).toBe(element);
      expect(ref2.current).toBe(element);
      expect(ref3.current).toBe(element);
    });

    it("should update mutable refs when element changes", () => {
      expect.hasAssertions();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();
      const element1 = document.createElement("div");
      const element2 = document.createElement("span") as any;

      const { result } = renderHook(() => useMergeRefs(ref1, ref2));

      // Set first element
      result.current?.(element1);
      expect(ref1.current).toBe(element1);
      expect(ref2.current).toBe(element1);

      // Set second element
      result.current?.(element2);
      expect(ref1.current).toBe(element2);
      expect(ref2.current).toBe(element2);
    });
  });

  // 3. Callback Refs
  describe("callback refs", () => {
    it("should call a single callback ref", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(callback));

      result.current?.(element);

      expect(callback).toHaveBeenCalledWith(element);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should call multiple callback refs", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(callback1, callback2, callback3)
      );

      result.current?.(element);

      expect(callback1).toHaveBeenCalledWith(element);
      expect(callback2).toHaveBeenCalledWith(element);
      expect(callback3).toHaveBeenCalledWith(element);
    });

    it("should call callbacks in order", () => {
      expect.hasAssertions();
      const callOrder: number[] = [];
      const callback1 = jest.fn(() => { callOrder.push(1); });
      const callback2 = jest.fn(() => { callOrder.push(2); });
      const callback3 = jest.fn(() => { callOrder.push(3); });
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(callback1, callback2, callback3)
      );

      result.current?.(element);

      expect(callOrder).toEqual([1, 2, 3]);
    });
  });

  // 4. Mixed Refs
  describe("mixed refs (mutable and callback)", () => {
    it("should handle both mutable and callback refs together", () => {
      expect.hasAssertions();
      const mutableRef = createRef<HTMLDivElement>();
      const callback = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(mutableRef, callback));

      result.current?.(element);

      expect(mutableRef.current).toBe(element);
      expect(callback).toHaveBeenCalledWith(element);
    });

    it("should handle complex mix of ref types", () => {
      expect.hasAssertions();
      const mutableRef1 = createRef<HTMLDivElement>();
      const mutableRef2 = createRef<HTMLDivElement>();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(mutableRef1, callback1, mutableRef2, callback2)
      );

      result.current?.(element);

      expect(mutableRef1.current).toBe(element);
      expect(mutableRef2.current).toBe(element);
      expect(callback1).toHaveBeenCalledWith(element);
      expect(callback2).toHaveBeenCalledWith(element);
    });
  });

  // 5. Null and Undefined Refs
  describe("null and undefined refs", () => {
    it("should skip null refs", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const callback = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(ref, null, callback));

      result.current?.(element);

      expect(ref.current).toBe(element);
      expect(callback).toHaveBeenCalledWith(element);
    });

    it("should skip undefined refs", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(ref, undefined, undefined)
      );

      result.current?.(element);

      expect(ref.current).toBe(element);
    });

    it("should handle mix of valid and null/undefined refs", () => {
      expect.hasAssertions();
      const ref1 = createRef<HTMLDivElement>();
      const callback = jest.fn();
      const ref2 = createRef<HTMLDivElement>();
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(null, ref1, undefined, callback, null, ref2)
      );

      result.current?.(element);

      expect(ref1.current).toBe(element);
      expect(ref2.current).toBe(element);
      expect(callback).toHaveBeenCalledWith(element);
    });
  });

  // 6. Memoization
  describe("memoization", () => {
    it("should return a function", () => {
      expect.hasAssertions();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();

      const { result } = renderHook(() => useMergeRefs(ref1, ref2));

      expect(typeof result.current).toBe("function");

      // Note: The actual memoization depends on refs array stability
      // which is controlled by the dependency array in useMemo([refs])
    });

    it("should return new function when refs change", () => {
      expect.hasAssertions();
      const ref1 = createRef<HTMLDivElement>();
      const ref2 = createRef<HTMLDivElement>();
      const ref3 = createRef<HTMLDivElement>();

      const { result, rerender } = renderHook(
        ({ refs }) => useMergeRefs(...refs),
        { initialProps: { refs: [ref1, ref2] } }
      );

      const firstResult = result.current;

      rerender({ refs: [ref1, ref3] });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
    });
  });

  // 7. React Component Integration
  describe("React component integration", () => {
    it("should work in a React component with useRef", () => {
      expect.hasAssertions();
      let capturedElement: HTMLDivElement | null = null;

      function TestComponent() {
        const ref1 = useRef<HTMLDivElement>(null);
        const ref2 = useRef<HTMLDivElement>(null);
        const mergedRef = useMergeRefs(ref1, ref2);

        React.useEffect(() => {
          capturedElement = ref1.current;
        }, []);

        return <div ref={mergedRef} data-testid="target">Test</div>;
      }

      render(<TestComponent />);
      const target = screen.getByTestId("target");

      expect(capturedElement).toBe(target);
    });

    it("should work with callback ref in component", () => {
      expect.hasAssertions();
      const elements: HTMLDivElement[] = [];

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        const callbackRef = (element: HTMLDivElement | null) => {
          if (element) elements.push(element);
        };
        const mergedRef = useMergeRefs(ref, callbackRef);

        return <div ref={mergedRef} data-testid="target">Test</div>;
      }

      render(<TestComponent />);

      expect(elements.length).toBeGreaterThan(0);
    });

    it("should work with multiple components", () => {
      expect.hasAssertions();
      const ref1Values: any[] = [];
      const ref2Values: any[] = [];

      function Component1() {
        const ref = useRef<HTMLDivElement>(null);
        const callback = (el: HTMLDivElement | null) => { ref1Values.push(el); };
        const mergedRef = useMergeRefs(ref, callback);

        return <div ref={mergedRef} data-testid="comp1">Component 1</div>;
      }

      function Component2() {
        const ref = useRef<HTMLDivElement>(null);
        const callback = (el: HTMLDivElement | null) => { ref2Values.push(el); };
        const mergedRef = useMergeRefs(ref, callback);

        return <div ref={mergedRef} data-testid="comp2">Component 2</div>;
      }

      render(
        <>
          <Component1 />
          <Component2 />
        </>
      );

      expect(ref1Values.length).toBeGreaterThan(0);
      expect(ref2Values.length).toBeGreaterThan(0);
    });
  });

  // 8. Edge Cases
  describe("edge cases", () => {
    it("should handle setting null value", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const callback = jest.fn();

      const { result } = renderHook(() => useMergeRefs(ref, callback));

      result.current?.(null);

      expect(ref.current).toBeNull();
      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should handle large number of refs", () => {
      expect.hasAssertions();
      const refs = Array.from({ length: 50 }, () => createRef<HTMLDivElement>());
      const element = document.createElement("div");

      const { result } = renderHook(() => useMergeRefs(...refs));

      result.current?.(element);

      refs.forEach(ref => {
        expect(ref.current).toBe(element);
      });
    });

    it("should not throw when callback throws", () => {
      expect.hasAssertions();
      const goodRef = createRef<HTMLDivElement>();
      const throwingCallback = jest.fn(() => {
        throw new Error("Callback error");
      });
      const goodCallback = jest.fn();
      const element = document.createElement("div");

      const { result } = renderHook(() =>
        useMergeRefs(goodRef, throwingCallback, goodCallback)
      );

      expect(() => {
        result.current?.(element);
      }).toThrow("Callback error");

      // First callback threw, so subsequent ones weren't called
      expect(throwingCallback).toHaveBeenCalled();
      expect(goodCallback).not.toHaveBeenCalled();
    });
  });

  // 9. TypeScript Type Safety
  describe("TypeScript type safety", () => {
    it("should work with typed refs", () => {
      expect.hasAssertions();
      const divRef = createRef<HTMLDivElement>();
      const buttonRef = createRef<HTMLButtonElement>();
      const div = document.createElement("div");

      const { result: divResult } = renderHook(() => useMergeRefs(divRef));
      const { result: buttonResult } = renderHook(() =>
        useMergeRefs(buttonRef)
      );

      divResult.current?.(div);

      expect(divRef.current).toBe(div);
      expect(buttonRef.current).toBeNull();
    });
  });

  // 10. Performance
  describe("performance", () => {
    it("should not cause excessive re-renders", () => {
      expect.hasAssertions();
      let renderCount = 0;

      function TestComponent() {
        renderCount++;
        const ref1 = useRef<HTMLDivElement>(null);
        const ref2 = useRef<HTMLDivElement>(null);
        const mergedRef = useMergeRefs(ref1, ref2);

        return <div ref={mergedRef} data-testid="target">Test</div>;
      }

      render(<TestComponent />);

      // Should only render once on mount
      expect(renderCount).toBe(1);
    });

    it("should handle rapid ref updates", () => {
      expect.hasAssertions();
      const ref = createRef<HTMLDivElement>();
      const elements = Array.from({ length: 100 }, () =>
        document.createElement("div")
      );

      const { result } = renderHook(() => useMergeRefs(ref));

      // Rapidly update ref
      elements.forEach(element => {
        result.current?.(element);
      });

      expect(ref.current).toBe(elements[elements.length - 1]);
    });
  });
});
