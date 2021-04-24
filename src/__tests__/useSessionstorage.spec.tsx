/**
 * @jest-environment jsdom
 */
import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act,
} from '@testing-library/react';
import React from 'react';
import { useSessionstorage } from '../hooks/useSessionstorage';

/**
 * @jest-environment jsdom
 */

describe('useSessionstorage defined', () => {
  it('should be defined', () => {
    expect(useSessionstorage).toBeDefined();
  });
});

describe('useSessionstorage with object destructuring', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const { value } = useSessionstorage('test-value', 'hello');

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it('initializes correctly', () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    expect(valueElement.innerHTML).toBe('hello');
  });
});

describe('useSessionstorage with array destructuring', () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const [currentValue] = useSessionstorage('test-value', 'hello');

      return (
        <div data-testid="container">
          <p data-testid="value">{currentValue}</p>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it('initializes correctly', () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, 'value');
    expect(valueElement.innerHTML).toBe('hello');
  });
});

// figure out tests

describe('useSessionstorage', () => {
  let App;
  beforeEach(() => {
    sessionStorage.clear();
    function SubApp1() {
      const { value: titan, set, remove } = useSessionstorage('titan', 'eren');

      return (
        <div>
          <button data-testid="new-value" onClick={() => set('mikasa')}>
            Add
          </button>
          <button data-testid="unset-value" onClick={() => remove()}>
            Remove
          </button>
          <p data-testid="element1">{titan}</p>
        </div>
      );
    }

    function SubApp2() {
      const { value: titan } = useSessionstorage('titan');

      return (
        <div>
          <p data-testid="element2">{titan}</p>
        </div>
      );
    }
    App = function () {
      return (
        <>
          <SubApp1 />
          <SubApp2 />
        </>
      );
    };
  });

  afterEach(cleanup); // <-- add this

  it.skip('updating one component should update the other automatically', () => {
    const { getByTestId: getByTestId1 } = render(<App />);
    const renderedElement1 = getByTestId1('element1');
    const renderedElement2 = getByTestId1('element2');
    expect(renderedElement1.textContent).toEqual('');
    expect(renderedElement2.textContent).toEqual('');
    expect(renderedElement1.textContent).toEqual('eren');
    // expect(renderedElement2.textContent).toEqual("eren");
  });

  it('setting the new value', () => {
    const { container } = render(<App />);
    const setToNewValueButton = getByTestId(
      container as HTMLElement,
      'new-value'
    );
    act(() => {
      fireEvent.click(setToNewValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, 'element1');
    expect(valueElement.innerHTML).toBe('mikasa');
  });

  it('unsetting the value', () => {
    const { container } = render(<App />);
    const unsetValueButton = getByTestId(
      container as HTMLElement,
      'unset-value'
    );
    act(() => {
      fireEvent.click(unsetValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, 'element1');
    expect(valueElement.innerHTML).toBe('');
  });
});

// figure out tests
