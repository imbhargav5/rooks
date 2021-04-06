import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useMediaMatch } from '../useMediaMatch';
import TestRenderer from 'react-test-renderer';
const { act } = TestRenderer;

type MediaQueryListListener = (ev: MediaQueryListEventMap['change']) => void;

describe('useMediaMatch', () => {
  afterEach(() => {
    delete (window as any).matchMedia;
  });

  it('should return a boolean', async () => {
    const matchMedia = jest.fn<MediaQueryList, [string]>();
    const addEventListener = jest.fn<
      void,
      [string, (ev: MediaQueryListEventMap['change']) => void]
    >();
    const removeEventListener = jest.fn<void, [string, () => void]>();
    let listener: MediaQueryListListener | undefined = undefined;

    matchMedia.mockReturnValue({
      addEventListener,
      removeEventListener,
      matches: true,
    } as any);
    addEventListener.mockImplementationOnce((_, l) => (listener = l));

    window.matchMedia = matchMedia;

    const { result, unmount } = renderHook(
      ({ query }) => useMediaMatch(query),
      {
        initialProps: { query: 'print' },
      }
    );

    expect(matchMedia).toHaveBeenCalledTimes(1);
    expect(matchMedia.mock.calls[0][0]).toBe('print');
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
    expect(result.current).toBe(true);

    // Invoking the listener changes the value
    const l = expectDefined<(ev: MediaQueryListEventMap['change']) => void>(
      listener
    );
    act(() => l({ matches: false } as any));
    expect(result.current).toBe(false);

    // Unmount, ensuring we unbind the listener
    expect(removeEventListener).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});

function expectDefined<T>(t: T | undefined): T {
  expect(t).toBeDefined();
  return t as T;
}
