/**
 * @jest-environment jsdom
 */
import { useCountdown } from '../hooks/useCountdown';

jest.useFakeTimers();

describe('useCountdown', () => {
  it('is defined', () => {
    expect(useCountdown).toBeDefined();
  });
  // it('works', () => {
  //   const OriginalDate = global.Date;
  //   const now = Date.now();

  //   let advancedTime;

  //   const advanceTimersInsideAct = time => {
  //     advancedTime += time;
  //     act(() => {
  //       jest.advanceTimersByTime(time)
  //     });
  //   };

  // beforeEach(() => {
  //   advancedTime = 0;
  //   global.Date = class extends Date {
  //     constructor(time) {
  //       super(time);
  //       return new OriginalDate(time || now + advancedTime);
  //     }
  //   };
  // });

  // afterEach(() => {
  //   global.Date = OriginalDate;
  // });

  // it('should run interval and clear it after unmount', () => {
  //   const now = Date.now();
  //   const endTime = new Date(now + 3000);

  //   global.Date = class extends Date {
  //     constructor(time) {
  //       return new OriginalDate(time || now);
  //     }
  //   };
  //   const { result, unmount } = renderHook(() => useCountdown(endTime));
  //   const countdown = result.current;

  //   expect(countdown).toEqual(3);
  //   expect(setInterval).toHaveBeenCalledTimes(1);

  //   unmount();

  //   expect(clearInterval).toHaveBeenCalledTimes(1);
  //   expect(clearInterval).toHaveBeenCalledWith(
  //     setInterval.mock.results[0].value,
  //   );
  // });

  // it('should call onDown after every interval', () => {
  //   const endTime = new Date(now + 3000);
  //   const onDown = jest.fn();

  //   renderHook(() => useCountdown(endTime, { onDown }));

  //   expect(onDown).toHaveBeenCalledTimes(0);
  //   advanceTimersInsideAct(1000);
  //   expect(onDown).toHaveBeenCalledTimes(1);
  //   advanceTimersInsideAct(1000);
  //   expect(onDown).toHaveBeenCalledTimes(2);
  //   advanceTimersInsideAct(1000);
  //   expect(onDown).toHaveBeenCalledTimes(3);
  //   advanceTimersInsideAct(1000);
  //   expect(onDown).toHaveBeenCalledTimes(3);
  // });

  // it('should call onEnd after it ends', () => {
  //   const endTime = new Date(now + 3000);
  //   const onEnd = jest.fn();
  //   renderHook(() => useCountdown(endTime, { interval: 1000, onEnd }));
  //   expect(onEnd).toHaveBeenCalledTimes(0);
  //   advanceTimersInsideAct(2000);
  //   expect(onEnd).toHaveBeenCalledTimes(0);
  //   advanceTimersInsideAct(2000);
  //   expect(onEnd).toHaveBeenCalledTimes(1);
  //   expect(clearInterval).toHaveBeenCalledWith(
  //     setInterval.mock.results[0].value,
  //   );
  // });
  // })
});

// figure out tests
