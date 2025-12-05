import { vi } from "vitest";
/**
 */
import { renderHook } from "@testing-library/react";
import { useNavigatorLanguage } from "@/hooks/useNavigatorLanguage";

describe("useNavigatorLanguage", () => {
  let languageGetter = vi.spyOn(window.navigator, "language", "get");

  beforeEach(() => {
    languageGetter = vi.spyOn(window.navigator, "language", "get");
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useNavigatorLanguage).toBeDefined();
  });

  it("should get the navigator language", () => {
    expect.hasAssertions();
    languageGetter.mockReturnValue("de");
    const { result } = renderHook(() => useNavigatorLanguage());
    expect(result.current).toBe("de");
  });
});
