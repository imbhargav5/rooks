import { renderHook } from "@testing-library/react";
import { useMergeRefs } from "@/hooks/useMergeRefs";

describe("useMergeRefs", () => {
  it("returns null when all refs are null", () => {
    const { result } = renderHook(() =>
      useMergeRefs<HTMLDivElement>(null, null)
    );
    expect(result.current).toBeNull();
  });

  it("assigns the value to callback and object refs, skipping undefined", () => {
    const cb = vi.fn();
    const obj = { current: null as HTMLDivElement | null };
    const { result } = renderHook(() =>
      useMergeRefs<HTMLDivElement | null>(
        cb,
        obj as never,
        undefined as never,
        null
      )
    );
    const el = document.createElement("div");
    result.current?.(el);
    expect(cb).toHaveBeenCalledWith(el);
    expect(obj.current).toBe(el);
    result.current?.(null);
    expect(cb).toHaveBeenLastCalledWith(null);
    expect(obj.current).toBeNull();
  });
});
