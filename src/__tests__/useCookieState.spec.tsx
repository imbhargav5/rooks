import { act, renderHook } from '@testing-library/react-hooks';
import { useCookieState } from '../hooks/useCookieState';

describe('useCookieState', () => {
  it('should be defined', () => {
    expect(useCookieState).toBeDefined();
  });
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useCookieState('my-cookie', 'awesome'));

    expect(result?.current?.value).toBe('awesome');
  });
  it('should update cookie', () => {
    const { result } = renderHook(() => useCookieState('my-cookie', 'cool'));

    act(() => {
      result?.current?.set('cool');
    });

    expect(result?.current?.value).toBe('cool');
  });
  it('should delete cookie', () => {
    const { result } = renderHook(() => useCookieState('my-cookie'));

    act(() => {
      result?.current?.remove();
    });

    expect(result?.current?.value).toBe(null);
  });
});

// figure out tests
