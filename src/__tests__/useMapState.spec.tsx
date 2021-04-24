import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import { useMapState } from '../hooks/useMapState';

const { act } = TestRenderer;

describe('useMapState', () => {
  it('should be defined', () => {
    expect(useMapState).toBeDefined();
  });
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1 }));
    expect(result.current[0]).toEqual({ a: 1 });
  });
  it('should set a new value correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1 }));
    act(() => {
      result.current[1].set('b', 2);
    });
    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });
  it('should update old value correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1 }));
    act(() => {
      result.current[1].set('a', 2);
    });
    expect(result.current[0]).toEqual({ a: 2 });
  });
  it('should set multiple new values correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1 }));
    act(() => {
      result.current[1].setMultiple({
        b: 2,
        c: 3,
      });
    });
    expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 });
  });
  it('should update old value correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1 }));
    act(() => {
      result.current[1].setMultiple({
        a: 2,
        b: 3,
      });
    });
    expect(result.current[0]).toEqual({ a: 2, b: 3 });
    expect(result.current[1].has('a')).toBeTruthy();
    expect(result.current[1].has('b')).toBeTruthy();
  });
  it('should remove existing values correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 3 }));
    act(() => {
      result.current[1].remove('a');
    });
    expect(result.current[0]).toEqual({ b: 3 });
  });
  it('should work when value to remove doesnot exist', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
    act(() => {
      result.current[1].remove('d');
    });
    expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 });
  });
  it('should remove multiple existing values correctly', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 3, c: 5 }));
    act(() => {
      result.current[1].removeMultiple('a', 'c');
    });
    expect(result.current[0]).toEqual({ b: 3 });
  });
  it('should work when value to removeMultiple doesnot exist', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
    act(() => {
      result.current[1].removeMultiple('d', 'e');
    });
    expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 });
  });
  it('should work when some values to removeMultiple doesnot exist', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
    act(() => {
      result.current[1].removeMultiple('a', 'e');
    });
    expect(result.current[0]).toEqual({ b: 2, c: 3 });
  });
  it('should removeAll values', () => {
    const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
    act(() => {
      result.current[1].removeAll();
    });
    expect(result.current[0]).toEqual({});
  });
});
