/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useDimensionsRef } from "../hooks/useDimensionsRef";

describe("useDimensionsRef", () => {
  it("should be defined", () => {
    expect(useDimensionsRef).toBeDefined();
  });

  describe("base", () => {
    it("runs immediately after mount", async () => {
      expect.assertions(1);
      const { result } = renderHook(() => useDimensionsRef());
      expect(result.current[0]).toBeDefined();
    });
  });
});
