/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useOnline } from "../hooks/useOnline";

describe("useOnline", () => {
  it("should be defined", () => {
    expect(useOnline).toBeDefined();
  });

  it("should get the online status", () => {
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
  });
});
