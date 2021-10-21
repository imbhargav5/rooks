/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useNavigatorLanguage } from "../hooks/useNavigatorLanguage";

describe("useNavigatorLanguage", () => {
  let languageGetter;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, "language", "get");
  });

  it("should be defined", () => {
    expect(useNavigatorLanguage).toBeDefined();
  });

  it("should get the navigator language", () => {
    languageGetter.mockReturnValue("de");
    const { result } = renderHook(() => useNavigatorLanguage());
    expect(result.current).toBe("de");
  });
});
