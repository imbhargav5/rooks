/**
 * @jest-environment jsdom
 */
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId,
} from '@testing-library/react';
import React from 'react';
import { useWillUnmount } from '../hooks/useWillUnmount';

describe('useWillUnmount', () => {
  let App;
  const mockCallback = jest.fn(() => null);
  // let firstCallback
  beforeEach(() => {
    function Child() {
      useWillUnmount(mockCallback);

      return null;
    }
    // firstCallback = jest.fn()
    App = function () {
      const [isChildVisible, setIsChildVisible] = React.useState(false);
      const [value, setValue] = React.useState(0);
      function toggleIsChildVisible() {
        setIsChildVisible(!isChildVisible);
      }

      return (
        <div>
          <p data-testid="value" onClick={() => setValue(value + 1)}>
            {value}
          </p>
          <button data-testid="toggle-child" onClick={toggleIsChildVisible}>
            Toggle child visibility
          </button>
          {isChildVisible && <Child />}
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it('should be defined', () => {
    expect(useWillUnmount).toBeDefined();
  });

  it('should only call the unmount function only when unmount', () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    const toggleChildElement = getByTestId(
      container as HTMLElement,
      'toggle-child'
    );
    expect(mockCallback.mock.calls.length).toBe(0);
    act(() => {
      fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls.length).toBe(0);
    act(() => {
      fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls.length).toBe(0);
    act(() => {
      fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls.length).toBe(1);
    act(() => {
      fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
