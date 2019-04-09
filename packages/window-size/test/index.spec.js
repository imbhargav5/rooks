/**
 * @jest-environment jsdom
 */
import React from "react";
import useWindowSize from "../src";
import WindowComponent from './WindowComponent'
import { render, getByTestId } from 'react-testing-library'
import { act } from 'react-dom/test-utils'; 

// simulate window resize 
function fireResize(type, value) {
  switch (type) {
    case 'innerWidth':
      window.innerWidth = value
      break;
    case 'innerHeight':
      window.innerHeight = value
      break;
    case 'outerWidth':
      window.outerWidth = value
      break;
    case 'outerHeight':
      window.outerHeight = value
      break;
    default:
      break;
  }
  window.dispatchEvent(new Event('resize'))
}

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect(useWindowSize).toBeDefined();
  });
});

describe("useWindowSize - innerWidth", () => {
  it("should get new size", () => {
    const { container, rerender } = render(<WindowComponent />)
    const innerWidth = getByTestId(container, "innerWidth");
    act(() => {
      fireResize('innerWidth',320)
      rerender(<WindowComponent />) 
    })
    expect(innerWidth.textContent).toBe('320')
    act(() => {
      fireResize('innerWidth',700)
      rerender(<WindowComponent />) 
    })
    expect(innerWidth.textContent).toBe('700')
  });
});

describe("useWindowSize - innerHeight", () => {
  it("should get new size", () => {
    const { container, rerender } = render(<WindowComponent />)
    const innerHeight = getByTestId(container, "innerHeight");
    act(() => {
      fireResize('innerHeight',320)
      rerender(<WindowComponent />) 
    })
    expect(innerHeight.textContent).toBe('320')
    act(() => {
      fireResize('innerHeight',700)
      rerender(<WindowComponent />) 
    })
    expect(innerHeight.textContent).toBe('700')
  });
});

describe("useWindowSize - outerWidth", () => {
  it("should get new size", () => {
    const { container, rerender } = render(<WindowComponent />)
    const outerWidth = getByTestId(container, "outerWidth");
    act(() => {
      fireResize('outerWidth', 320)
      rerender(<WindowComponent />) 
    })
    expect(outerWidth.textContent).toBe('320')
    act(() => {
      fireResize('outerWidth', 700)
      rerender(<WindowComponent />) 
    })
    expect(outerWidth.textContent).toBe('700')
  });
});

describe("useWindowSize - outerHeight", () => {
  it("should get new size", () => {
    const { container, rerender } = render(<WindowComponent />)
    const outerHeight = getByTestId(container, "outerHeight");
    act(() => {
      fireResize('outerHeight',320)
      rerender(<WindowComponent />) 
    })
    expect(outerHeight.textContent).toBe('320')
    act(() => {
      fireResize('outerHeight',700)
      rerender(<WindowComponent />) 
    })
    expect(outerHeight.textContent).toBe('700')
  });
});