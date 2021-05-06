import {
  render,
  cleanup,
  fireEvent,
  act,
  screen,
} from '@testing-library/react';
import React, { useRef } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

const cb = jest.fn();

// condition does not have default value so we can test default of hook
const App = ({ condition }: { condition?: boolean }) => {
  const containerRef = useRef(null);
  useOutsideClick(containerRef, cb, condition);

  return (
    <div data-testid="app">
      <div data-testid="parent">
        Clicking here fires event.
        <div ref={containerRef} data-testid="container">
          Clicking here does nothing.
          <div data-testid="child">Clicking here also does nothing.</div>
        </div>
        <div data-testid="outside">Clicking here fires event.</div>
      </div>
    </div>
  );
};

/*
 * This just runs each test using a touch event and a click event,
 * replacing "click" in the name with "touch"
 */
const itClickAndTouch = (
  name: string,
  fn: (clickOrTouch: (testId: string) => void) => void
) => {
  const clickByTestId = (testId: string) => {
    const target = screen.getByTestId(testId);
    act(() => {
      fireEvent.click(target);
    });
  };
  const touchByTestId = (testId: string) => {
    const target = screen.getByTestId(testId);
    act(() => {
      fireEvent.touchStart(target);
    });
  };

  it(name, () => {
    fn(clickByTestId);
  });

  it(name.replace('click', 'touch'), () => {
    fn(touchByTestId);
  });
};

describe('useOutsideClick', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(useOutsideClick).toBeDefined();
  });

  itClickAndTouch(
    'should not fire event when clicking inside container',
    (clickOrTouch) => {
      render(<App />);
      clickOrTouch('container');
      expect(cb).not.toHaveBeenCalled();
    }
  );

  itClickAndTouch(
    'should not fire event when clicking child inside container',
    (clickOrTouch) => {
      render(<App />);
      clickOrTouch('child');
      expect(cb).not.toHaveBeenCalled();
    }
  );

  itClickAndTouch(
    'should fire event when clicking parent of container',
    (clickOrTouch) => {
      render(<App />);
      clickOrTouch('parent');
      expect(cb).toHaveBeenCalledTimes(1);
      clickOrTouch('child');
      clickOrTouch('container');
      expect(cb).toHaveBeenCalledTimes(1);
    }
  );

  itClickAndTouch(
    'should fire event when clicking sibling of container',
    (clickOrTouch) => {
      render(<App />);
      clickOrTouch('outside');
      expect(cb).toHaveBeenCalledTimes(1);
      clickOrTouch('child');
      clickOrTouch('container');
      expect(cb).toHaveBeenCalledTimes(1);
    }
  );

  itClickAndTouch(
    'should not fire event when clicking if condition disabled',
    (clickOrTouch) => {
      render(<App condition={false} />);
      ['parent', 'child', 'outside', 'container'].forEach((id) =>
        clickOrTouch(id)
      );
      expect(cb).not.toHaveBeenCalled();
    }
  );

  itClickAndTouch(
    'should change whether firing when updating `when` on click',
    (clickOrTouch) => {
      const { rerender } = render(<App condition={false} />);
      clickOrTouch('container');
      clickOrTouch('parent');
      expect(cb).toHaveBeenCalledTimes(0);
      rerender(<App condition={true} />);
      clickOrTouch('container');
      clickOrTouch('parent');
      expect(cb).toHaveBeenCalledTimes(1);
      rerender(<App condition={false} />);
      clickOrTouch('container');
      clickOrTouch('parent');
    }
  );
});
