import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useIdle } from "@/hooks/useIdle";

const { act } = TestRenderer;

describe("useIdle", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIdle).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdle({ threshold: 60000 }));
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should validate threshold", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdle({ threshold: 30000 }));
    
    expect(result.current.isIdle).toBe(false);
  });

  it("should handle options", () => {
    expect.hasAssertions();
    const onIdleChange = jest.fn();
    const onError = jest.fn();
    
    const { result } = renderHook(() => useIdle({ 
      threshold: 60000, 
      autoStart: false,
      onIdleChange,
      onError 
    }));
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });
});