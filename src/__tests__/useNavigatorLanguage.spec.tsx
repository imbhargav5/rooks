/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useNavigatorLanguage } from "../hooks/useNavigatorLanguage";

describe("useNavigatorLanguage", () => {
  it("should be defined", () => {
    expect(useNavigatorLanguage).toBeDefined();
  });

  it("should get the navigator language", () => {
    const { result } = renderHook(() => useNavigatorLanguage());
    expect(result.current).toBe("en-US");
  });
});
