import { renderHook } from "@testing-library/react-hooks";
import { useFullscreen } from "../useFullscreen";


describe("useFullscreen", () => {
  it("should be defined", () => {
    expect(useFullscreen).toBeDefined()
  })
  it('should return an object', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(typeof result.current).toBe("object")    
  })
})

