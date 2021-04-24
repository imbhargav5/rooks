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
import { useKey } from '../hooks/useKey';

describe('useKey', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const inputRef = React.useRef(null);
      const [value, setValue] = React.useState(0);
      useKey(['s'], () => {
        setValue(value + 1);
      });
      useKey(
        ['r'],
        () => {
          setValue(value + 1);
        },
        {
          target: inputRef,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
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
    expect(useKey).toBeDefined();
  });

  it('should trigger the calback when pressed on document or target', () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    const inputElement = getByTestId(container as HTMLElement, 'input');
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: 'keyS', key: 's' });
    });
    expect(valueElement.innerHTML).toBe('1');
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: 'keyR', key: 'r' });
    });
    expect(valueElement.innerHTML).toBe('2');
  });
});

describe('non array input', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const inputRef = React.useRef(null);
      const [value, setValue] = React.useState(0);
      useKey('s', () => {
        setValue(value + 1);
      });
      useKey(
        'r',
        () => {
          setValue(value + 1);
        },
        {
          target: inputRef,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
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
    expect(useKey).toBeDefined();
  });

  it('should trigger the calback when pressed on document or target', () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    const inputElement = getByTestId(container as HTMLElement, 'input');
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: 'keyS', key: 's' });
    });
    expect(valueElement.innerHTML).toBe('1');
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: 'keyR', key: 'r' });
    });
    expect(valueElement.innerHTML).toBe('2');
  });
});

describe('when', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const inputRef = React.useRef(null);
      const [when, setWhen] = React.useState(true);

      function toggleWhen() {
        setWhen(!when);
      }
      const [value, setValue] = React.useState(0);
      useKey(
        ['s'],
        () => {
          setValue(value + 1);
        },
        {
          when,
        }
      );
      useKey(
        ['r'],
        () => {
          setValue(value + 1);
        },
        {
          target: inputRef,
          when,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button data-testid="toggle-when" onClick={toggleWhen}>
            {' '}
            Toggle when
          </button>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
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
    expect(useKey).toBeDefined();
  });

  it("should not trigger whenever 'when ' value is false and trigger when 'when' is true", () => {
    const { container } = render(<App />);
    console.log('container.innerHTML before', container.innerHTML);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    const inputElement = getByTestId(container as HTMLElement, 'input');
    const toggleWhenElement = getByTestId(
      container as HTMLElement,
      'toggle-when'
    );
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: 'keyS', key: 's' });
    });
    expect(valueElement.innerHTML).toBe('1');
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: 'keyR', key: 'r' });
    });
    expect(valueElement.innerHTML).toBe('2');
    // disable when
    act(() => {
      fireEvent.click(toggleWhenElement);
    });
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: 'keyS', key: 's' });
    });
    expect(valueElement.innerHTML).toBe('2');
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: 'keyR', key: 'r' });
    });
    expect(valueElement.innerHTML).toBe('2');
    // enable when
    act(() => {
      fireEvent.click(toggleWhenElement);
    });
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: 'keyS', key: 's' });
    });
    expect(valueElement.innerHTML).toBe('3');
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: 'keyR', key: 'r' });
    });
    expect(valueElement.innerHTML).toBe('4');
  });
});
