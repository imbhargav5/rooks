/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from '@testing-library/react-hooks';
import { useState } from 'react';
import TestRenderer from 'react-test-renderer';
import { useIntervalWhen } from '../hooks/useIntervalWhen';

const { act } = TestRenderer;

describe('useIntervalWhen', () => {
  let useHook;

  beforeEach(() => {
    useHook = function () {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      useIntervalWhen(() => {
        increment();
      }, 1_000);

      return { currentValue };
    };
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(useIntervalWhen).toBeDefined();
  });
  it('should start timer when started with start function', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });

  it('should start timer when started with start function in array destructuring', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });
});
