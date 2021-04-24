/**
 * @jest-environment jsdom
 */
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import React, { useState } from 'react';
import { usePrevious } from '../hooks/usePrevious';

describe('usePrevious', () => {
  let App;

  beforeEach(() => {
    App = function () {
      const [currentValue, setCurrentValue] = useState(0);
      const previousValue = usePrevious(currentValue);
      function increment() {
        setCurrentValue(currentValue + 1);
      }

      return (
        <div>
          <p data-testid="current-element" onClick={increment}>
            {currentValue}
          </p>
          <p data-testid="previous-element">{previousValue}</p>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it('should be defined', () => {
    expect(usePrevious).toBeDefined();
  });
  it('sets initial value to null and updates after change in tracked value', () => {
    const { getByTestId } = render(<App />);
    const currentElement = getByTestId('current-element');
    const previousElement = getByTestId('previous-element');
    expect(currentElement.innerHTML).toBe('0');
    expect(previousElement.innerHTML).toBe('');
    act(() => {
      fireEvent.click(currentElement);
    });
    expect(currentElement.innerHTML).toBe('1');
    expect(previousElement.innerHTML).toBe('0');
  });
});

// figure out tests
