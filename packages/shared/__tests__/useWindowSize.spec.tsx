/**
 * @jest-environment jsdom
 */
import {useWindowSize} from "../useWindowSize";
import {  
    act,
  fireEvent,  
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect(useWindowSize).toBeDefined();
  });

  describe("basic", () => {
    it("should have an initial value on first render", () => {
      const {result} = renderHook(()=>useWindowSize())
      expect(result.current.innerHeight).not.toBeNull();            
    });
  });
});