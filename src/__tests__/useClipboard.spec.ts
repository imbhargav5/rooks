/**
 * @jest-environment jsdom
 */
import { useClipboard } from '../hooks/useClipboard';

describe('useClipboard', () => {
  it('should be defined', () => {
    expect(useClipboard).toBeDefined();
  });
});

// figure out tests
