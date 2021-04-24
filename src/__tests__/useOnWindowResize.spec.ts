/**
 * @jest-environment jsdom
 */
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useOnWindowResize } from '../hooks/useOnWindowResize';

describe('useOnWindowResize', () => {
  it('should be defined', () => {
    expect(useOnWindowResize).toBeDefined();
  });

  describe('basic', () => {
    const mockCallback = jest.fn(() => {});
    it('should call callback after resize', () => {
      renderHook(() => useOnWindowResize(mockCallback));
      fireEvent(window, new Event('resize'));
      expect(mockCallback.mock.calls.length).toBe(1);
      fireEvent(window, new Event('resize'));
      fireEvent(window, new Event('resize'));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});

// figure out tests
