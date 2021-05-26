/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useSet } from '../hooks/useSet';

const setUp = <K>(initialSet?: Set<K>) => renderHook(() => useSet(initialSet));

describe('useSet', () => {
  it('should be defined', () => {
    expect(useSet).toBeDefined();
  });
});

it('should init set and utils', () => {
  const { result } = setUp(new Set(['hello']));
  const [set, utils] = result.current;

  expect(set).toEqual(new Set(['hello']));
  expect(utils).toStrictEqual({
    add: expect.any(Function),
    has: expect.any(Function),
    remove: expect.any(Function),
    removeAll: expect.any(Function),
  });
});

it('should init empty set if no initial set provided', () => {
  const { result } = setUp();

  expect(result.current[0]).toEqual(new Set());
});

it('should have an initially provided key', () => {
  const { result } = setUp(new Set(['hello']));
  const [, utils] = result.current;

  let value;
  act(() => {
    value = utils.has('hello');
  });

  expect(value).toBe(true);
});

it('should have an added key', () => {
  const { result } = setUp(new Set());

  act(() => {
    result.current[1].add('a');
  });

  let value;
  act(() => {
    value = result.current[1].has('a');
  });

  expect(value).toBe(true);
});

it('should remove existing key', () => {
  const { result } = setUp(new Set(['a', 'b']));
  const [, utils] = result.current;

  act(() => {
    utils.remove('b');
  });

  expect(result.current[0]).toEqual(new Set(['a']));
});

it('should get false for non-existing key', () => {
  const { result } = setUp(new Set(['a']));
  const [, utils] = result.current;

  let value;
  act(() => {
    value = utils.has('nonExisting');
  });

  expect(value).toBe(false);
});

it('should add a new key', () => {
  const { result } = setUp(new Set(['b']));
  const [, utils] = result.current;

  act(() => {
    utils.add('a');
  });

  expect(result.current[0]).toEqual(new Set(['b', 'a']));
});

it('should work if setting existing key', () => {
  const { result } = setUp(new Set(['b']));
  const [, utils] = result.current;

  act(() => {
    utils.add('b');
  });

  expect(result.current[0]).toEqual(new Set(['b']));
});

it('should remove all to initial set provided', () => {
  const { result } = setUp(new Set(['a']));
  const [, utils] = result.current;

  act(() => {
    utils.add('b');
  });

  expect(result.current[0]).toEqual(new Set(['a', 'b']));

  act(() => {
    utils.removeAll();
  });

  expect(result.current[0]).toEqual(new Set(['a']));
});

it('should do nothing if removing non-existing key', () => {
  const { result } = setUp(new Set(['a', 'b']));
  const [, utils] = result.current;

  act(() => {
    utils.remove('nonExisting');
  });

  expect(result.current[0]).toEqual(new Set(['a', 'b']));
});

// figure out tests
