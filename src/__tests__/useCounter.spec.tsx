import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import { useCounter } from '../hooks/useCounter';

const { act } = TestRenderer;

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useCounter).toBeDefined();
  });
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.value).toBe(0);
  });
  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(1);
  });
  it('should decrement', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.value).toBe(-1);
  });
  it('should incrementBy', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.incrementBy(7);
    });

    expect(result.current.value).toBe(12);
  });
  it('should decrementBy', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrementBy(7);
    });

    expect(result.current.value).toBe(-2);
  });
});
