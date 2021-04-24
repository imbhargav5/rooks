import { render, getByTestId, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useCounter } from '../hooks/useCounter';
import { useWindowEventListener } from '../hooks/useWindowEventListener';

const { act } = TestRenderer;

describe('useWindowEventListener', () => {
  it('should be defined', () => {
    expect(useWindowEventListener).toBeDefined();
  });
  it('should return a undefined', () => {
    const { result } = renderHook(() =>
      useWindowEventListener('click', () => {
        console.log('clicked');
      })
    );

    expect(typeof result.current).toBe('undefined');
  });
});

describe('useWindowEventListener jsx', () => {
  let mockCallback;
  let TestJSX;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = function () {
      useWindowEventListener('click', mockCallback);

      return null;
    };
  });

  it('should not call callback by default', () => {
    render(<TestJSX />);
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it('should not call callback when event fires', () => {
    render(<TestJSX />);
    act(() => {
      fireEvent.click(window);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(window);
      fireEvent.click(window);
      fireEvent.click(window);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});

describe('useWindowEventListener state variables', () => {
  let TestJSX;
  beforeEach(() => {
    TestJSX = function () {
      const { increment, value } = useCounter(0);
      useWindowEventListener('click', increment);

      return <div data-testid="value">{value}</div>;
    };
  });

  it('should not call callback by default', () => {
    const { container } = render(<TestJSX />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
  });

  it('should not call callback when event fires', () => {
    const { container } = render(<TestJSX />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
    act(() => {
      fireEvent.click(window);
      fireEvent.click(window);
      fireEvent.click(window);
    });
    expect(Number.parseInt(valueElement.innerHTML)).toBe(3);
  });
});
