import React from 'react'
import { renderHook } from "@testing-library/react-hooks";
import { useFullscreen } from "../useFullscreen";
import TestRenderer from 'react-test-renderer';
const { act } = TestRenderer;


describe("useFullscreen", () => {
  it("should be defined", () => {
    expect(useFullscreen).toBeDefined()
  })
  it('should return an object', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(typeof result.current).toBe("object")    
  })
})

describe("useFullscreen jsx", () => {
  let mockCallback;
  let TestJSX
  beforeEach(() => {
    mockCallback = jest.fn(() => { });
    TestJSX = function () {
      useFullscreen();
      return null;
    }
  })
});