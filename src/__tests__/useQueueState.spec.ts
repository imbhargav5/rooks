import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import { useQueueState } from '../hooks/useQueueState';

const { act } = TestRenderer;

describe('useQueueState', () => {
  it('should be defined', () => {
    expect(useQueueState).toBeDefined();
  });
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });
  it('should return length correctly', () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    const [, controls] = result.current;
    expect(controls.length).toBe(3);
  });
  it('should enqueue correctly', () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));

    act(() => {
      result.current[1].enqueue(7);
    });
    const [list, controls] = result.current;
    expect(list).toEqual([1, 2, 3, 7]);
    expect(controls.length).toBe(4);
  });
  it('should peek and dequeue correctly', () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    act(() => {
      result.current[1].enqueue(7);
    });
    act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toEqual(1);
    act(() => {
      result.current[1].dequeue();
    });
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toEqual(3);
    expect(result.current[1].length).toEqual(3);
  });
  it('handles empty arrays', () => {
    const { result } = renderHook(() => useQueueState([]));
    act(() => {
      result.current[1].dequeue();
    });
    act(() => {
      result.current[1].dequeue();
    });
    const [, controls] = result.current;
    expect(controls.peek()).toEqual(undefined);
    expect(controls.length).toEqual(0);
    act(() => {
      result.current[1].enqueue(7);
    });
    act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toEqual(7);
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toEqual(11);
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toBeUndefined();
    expect(result.current[1].length).toEqual(0);
  });
});
