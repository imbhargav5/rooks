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

const clickByTestId = (testId: string) => {
  const target = screen.getByTestId(testId);
  act(() => {
    fireEvent.click(target);
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

  it('should not fire event when clicking inside container', () => {
    render(<App />);
    clickByTestId('container');
    expect(cb).not.toHaveBeenCalled();
  });

  it('should not fire event when clicking child inside container', () => {
    render(<App />);
    clickByTestId('child');
    expect(cb).not.toHaveBeenCalled();
  });

  it('should fire event when clicking parent of container', () => {
    render(<App />);
    clickByTestId('parent');
    expect(cb).toHaveBeenCalledTimes(1);
    clickByTestId('child');
    clickByTestId('container');
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should fire event when clicking sibling of container', () => {
    render(<App />);
    clickByTestId('outside');
    expect(cb).toHaveBeenCalledTimes(1);
    clickByTestId('child');
    clickByTestId('container');
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should not fire event if condition disabled', () => {
    render(<App condition={false} />);
    ['parent', 'child', 'outside', 'container'].forEach((id) =>
      clickByTestId(id)
    );
    expect(cb).not.toHaveBeenCalled();
  });

  it('should change whether firing when updating `when`', () => {
    const { rerender } = render(<App condition={false} />);
    clickByTestId('container');
    clickByTestId('parent');
    expect(cb).toHaveBeenCalledTimes(0);
    rerender(<App condition={true} />);
    clickByTestId('container');
    clickByTestId('parent');
    expect(cb).toHaveBeenCalledTimes(1);
    rerender(<App condition={false} />);
    clickByTestId('container');
    clickByTestId('parent');
  });
});
