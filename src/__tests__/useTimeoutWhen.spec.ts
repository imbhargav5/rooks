/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import { useTimeoutWhen } from '../hooks/useTimeoutWhen';

describe('useTimeoutWhen', () => {
  it('should be defined', () => {
    expect(useTimeoutWhen).toBeDefined();
  });
});

describe('base', () => {
  let useHook;
  beforeEach(() => {
    useHook = function () {
      const [value, setValue] = useState(0);
      useTimeoutWhen(() => {
        setValue(9_000);
      }, 1_000);

      return { value };
    };
  });
  it('runs immediately after mount', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(result.current.value).toBe(9_000);
    jest.useRealTimers();
  });
});

// describe.skip("use-timeout base", async () => {
//   let Component;
//   let mockCallback;
//   const TIMEOUT_MS = 1000;
//   beforeEach(() => {
//     Component = function() {
//       const [value, setValue] = useState(0);
//       mockCallback = jest.fn(() => setValue(3));

//       useTimeoutWhen(mockCallback, TIMEOUT_MS);
//     };
//   });
//   afterEach(cleanup); // <-- add this

// //   it("should set value after timeout", () => {
// //     jest.useFakeTimers();
// //     const {result} = renderHook(()=> useHook())
// //     expect(result.current.value).toBe(9000)
// //     jest.advanceTimersByTime(1000);
// //   })

// //   it("should initially not run timeoutcallback unless start is invoked", () => {
// //     render(<Component />);
// //     jest.useFakeTimers();
// //     expect(mockCallback.mock.calls.length).toBe(0);
// //     jest.useRealTimers(); //needed for wait
// //   });
// //   it("should run timeoutcallback when start is invoked", async () => {
// //     jest.useFakeTimers();
// //     const { getByTestId } = render(<Component />);
// //     expect(mockCallback.mock.calls.length).toBe(0);
// //     act(() => {
// //       fireEvent.click(getByTestId("start-button"));
// //       jest.runAllTimers();
// //     });
// //     jest.useRealTimers(); //needed for wait
// //     //TODO: no idea why I need to wait for next tick
// //     waitFor(() => {
// //       expect(mockCallback.mock.calls.length).toBe(1);
// //     });
// //   });
// });
