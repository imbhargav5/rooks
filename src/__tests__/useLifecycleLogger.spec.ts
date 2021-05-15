/**
 * @jest-environment jsdom
 */
import React from 'react';
import { useLifecycleLogger } from '../hooks/useLifecycleLogger';

describe('useLifecycleLogger', () => {
  it('should be defined', () => {
    expect(useLifecycleLogger).toBeDefined();
  });
});

// figure out tests
