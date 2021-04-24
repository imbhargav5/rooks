/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import { usePreviousDifferent } from '../hooks/usePreviousDifferent';

describe('usePreviousDifferent', () => {
  let useHook;
  beforeEach(() => {
    useHook = function () {
      const [value, setValue] = useState(0);
      const [value2, setValue2] = useState(0);
      const previousValue = usePreviousDifferent(value);
      const increment = () => {
        setValue(value + 1);
      };
      const increment2 = () => {
        setValue2(value2 + 1);
      };

      return { increment, increment2, previousValue, value, value2 };
    };
  });
  it('isDefined', async () => {
    expect(usePreviousDifferent).toBeDefined();
  });
  it('initially returns null', async () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.previousValue).toBeNull();
  });

  it('holds the previous value', async () => {
    const { result } = renderHook(() => useHook());
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
    expect(result.current.previousValue).toBe(0);
  });
  it('does not update the previous value if current value is unchanged', async () => {
    const { result } = renderHook(() => useHook());
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
    expect(result.current.previousValue).toBe(0);
    act(() => {
      result.current.increment2();
    });
    expect(result.current.value2).toBe(1);
    expect(result.current.value).toBe(1);
    expect(result.current.previousValue).toBe(0);
    act(() => {
      result.current.increment2();
    });
    act(() => {
      result.current.increment();
    });
    act(() => {
      result.current.increment2();
    });
    expect(result.current.value2).toBe(3);
    expect(result.current.value).toBe(2);
    expect(result.current.previousValue).toBe(1);
  });
});
// figure out tests
