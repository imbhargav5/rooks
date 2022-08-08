/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useOnline } from "@/hooks/useOnline";

describe("useOnline", () => {
  let onlineGetter = jest.spyOn(window.navigator, "onLine", "get");

  beforeEach(() => {
    onlineGetter = jest.spyOn(window.navigator, "onLine", "get");
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnline).toBeDefined();
  });

  it("should get the online status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
  });

  it("should get the offline status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(false);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(false);
  });
});
