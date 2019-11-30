/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';

import useTime from '..';

describe('useTime', () => {
  const DateOriginal = global.Date;
  const now = Date.now();

  let advancedTime;

  const advanceTimers = time => {
    advancedTime += time;
    jest.advanceTimersByTime(time);
  };

  beforeEach(() => {
    jest.useFakeTimers();

    advancedTime = 0;
    global.Date = class extends Date {
      constructor(time) {
        return new DateOriginal(time || now + advancedTime);
      }
    };
  });

  afterEach(() => {
    global.Date = DateOriginal;
  });

  it('should return new time and call onTick after every interval', () => {
    const mockOnTick = jest.fn();
    const { result, rerender } = renderHook(useTime);

    expect(result.current.getTime() - now).toBe(0);

    // 1st interval(1s)
    act(() => advanceTimers(999));
    expect(result.current.getTime() - now).toBe(0);
    act(() => advanceTimers(1));
    expect(result.current.getTime() - now).toBe(1000);

    // 2nd interval(1s), simulating the inaccurate setInterval
    act(() => advanceTimers(1001));
    expect(result.current.getTime() - now).toBe(2001);

    // 3rd interval(2s)
    rerender({ interval: 2000, onTick: mockOnTick });

    act(() => advanceTimers(1500));
    expect(result.current.getTime() - now).toBe(2001);
    expect(mockOnTick).not.toHaveBeenCalled();
    act(() => advanceTimers(500));
    expect(result.current.getTime() - now).toBe(4001);
    expect(mockOnTick).toHaveBeenCalledWith(result.current);
  });

  it('should run interval and clear it after rerender/unmount', () => {
    const { rerender, unmount } = renderHook(useTime);

    expect(setInterval).toHaveBeenCalledTimes(1);

    rerender({ interval: 4000 });

    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledWith(
      setInterval.mock.results[0].value,
    );
    expect(setInterval).toHaveBeenCalledTimes(2);

    unmount();

    expect(clearInterval).toHaveBeenCalledTimes(2);
    expect(clearInterval).toHaveBeenCalledWith(
      setInterval.mock.results[1].value,
    );
  });
  
  it('should not tick if interval is not positive', () => {
    renderHook(() => useTime({ interval: 0 }));

    expect(setInterval).toHaveBeenCalledTimes(0);
  });
});
