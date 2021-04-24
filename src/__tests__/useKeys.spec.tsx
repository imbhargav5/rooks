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
import { useKeys } from '../hooks/useKeys';

describe('useKeys', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const documentRef = React.useRef(document);
      const inputRef = React.useRef(null);
      const [isEventActive, setIsEventActive] = React.useState(true);
      const [testValue] = React.useState(0);
      const [
        firstCallbackCallCount,
        setFirstCallbackCallCount,
      ] = React.useState(0);
      useKeys(
        ['ControlLeft', 's'],
        () => {
          setFirstCallbackCallCount(firstCallbackCallCount + 1);
        },
        {
          target: documentRef,
          when: isEventActive,
        }
      );
      useKeys(
        ['m', 'r'],
        () => {
          setFirstCallbackCallCount(firstCallbackCallCount + 1);
        },
        {
          target: inputRef,
          when: isEventActive,
        }
      );

      return (
        <div data-testid="container">
          <p id="test-id">{testValue}</p>
          <p data-testid="first-callback">{firstCallbackCallCount}</p>
          <button
            data-testid="toggle"
            onClick={() => {
              setIsEventActive(!isEventActive);
            }}
          >
            Toggle event enabled
          </button>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input-dom"
              ref={inputRef}
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it('should be defined', () => {
    expect(useKeys).toBeDefined();
  });

  it('should trigger the calback when pressed m + r', () => {
    const { container } = render(<App />);
    const firstcallbackP = getByTestId(
      container as HTMLElement,
      'first-callback'
    );
    const InputDom = getByTestId(container as HTMLElement, 'input-dom');
    act(() => {
      fireEvent.keyDown(InputDom, { charCode: 77, code: 'keyM', key: 'm' });
    });
    act(() => {
      fireEvent.keyDown(InputDom, { charCode: 82, code: 'keyR', key: 'r' });
    });

    expect(firstcallbackP.innerHTML).toBe('1');
  });

  it('should trigger the callback when pressed ctrlLeft + s', () => {
    const { container } = render(<App />);

    const firstcallbackP = getByTestId(
      container as HTMLElement,
      'first-callback'
    );
    // let InputDom = getByTestId(container, "input-dom");
    fireEvent.keyDown(document, {
      charCode: 17,
      code: 'ControlLeft',
      key: 'Control',
    });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });

    expect(firstcallbackP.innerHTML).toBe('1');
  });

  it("should not trigger whenever 'when ' value is false and trigger whenever'when' value is true", () => {
    const { container } = render(<App />);

    const firstcallbackP = getByTestId(
      container as HTMLElement,
      'first-callback'
    );
    const ToggleButton = getByTestId(container as HTMLElement, 'toggle');
    fireEvent.click(ToggleButton);

    fireEvent.keyDown(document, {
      charCode: 17,
      code: 'ControlLeft',
      key: 'Control',
    });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });

    expect(firstcallbackP.innerHTML).toBe('0');

    fireEvent.click(ToggleButton);

    // now the callback should run
    fireEvent.keyDown(document, {
      charCode: 17,
      code: 'ControlLeft',
      key: 'Control',
    });

    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });

    expect(firstcallbackP.innerHTML).toBe('1');
  });
});

describe('useKeys: continuous mode', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const [testValue, setTestValue] = React.useState(0);
      useKeys(
        ['ControlLeft', 's'],
        () => {
          setTestValue(testValue + 1);
        },
        {
          continuous: true,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value" id="value">
            {testValue}
          </p>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("should trigger continuously whenever 'continuous' is true", () => {
    const { container } = render(<App />);

    const testValueElement = getByTestId(container as HTMLElement, 'value');

    fireEvent.keyDown(document, {
      charCode: 17,
      code: 'ControlLeft',
      key: 'Control',
    });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });

    expect(testValueElement.innerHTML).toBe('1');
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    expect(testValueElement.innerHTML).toBe('6');
    // now it should no longer increment after keyup
    fireEvent.keyUp(document, {
      charCode: 17,
      code: 'ControlLeft',
      key: 'Control',
    });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    fireEvent.keyDown(document, { charCode: 83, code: 'keyS', key: 's' });
    expect(testValueElement.innerHTML).toBe('6');
  });
});
