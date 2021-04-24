/**
 * @jest-environment jsdom
 */
import { act, renderHook, cleanup } from '@testing-library/react-hooks';
import { useState } from 'react';
import { useEffectOnceWhen } from '../hooks/useEffectOnceWhen';

describe('useEffectOnceWhen', () => {
  let useHook;
  beforeEach(() => {
    useHook = function () {
      const [value, setValue] = useState(0);
      const [isEnabled, setIsEnabled] = useState(false);
      useEffectOnceWhen(() => {
        setValue(value + 1);
      }, isEnabled);

      return { setIsEnabled, value };
    };
  });
  afterEach(cleanup); // <-- add this

  it('should be defined', () => {
    expect(useEffectOnceWhen).toBeDefined();
  });

  it('runs immediately after condition is enabled', async () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.setIsEnabled(true);
    });
    expect(result.current.value).toBe(1);
  });

  it("doesn't run twice after condition is enabled", async () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.value).toBe(0);
    act(() => {
      result.current.setIsEnabled(true);
    });
    expect(result.current.value).toBe(1);
    act(() => {
      result.current.setIsEnabled(false);
    });
    act(() => {
      result.current.setIsEnabled(true);
    });
    expect(result.current.value).toBe(1);
  });
});
