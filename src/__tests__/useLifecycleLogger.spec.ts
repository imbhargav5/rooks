/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import { useLifecycleLogger } from '../hooks/useLifecycleLogger';

const logSpy = jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('useLifecycleLogger', () => {
  it('should be defined', () => {
    expect(useLifecycleLogger).toBeDefined();
  });
  it('should log the provided props on mount', () => {
    const props = { answer: 42, question: 'What is the meaning?' };
    renderHook(() => useLifecycleLogger('Test', props));

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith('Test mounted', props);
  });

  it('should log when the component has unmounted', () => {
    const props = { answer: 42, question: 'What is the meaning?' };
    const { unmount } = renderHook(() => useLifecycleLogger('Test', props));

    unmount();

    expect(logSpy).toHaveBeenLastCalledWith('Test unmounted');
  });

  it('should log updates as props change', () => {
    const { rerender } = renderHook(
      ({ componentName, props }: { componentName: string; props: any }) =>
        useLifecycleLogger(componentName, props),
      {
        initialProps: { componentName: 'Test', props: { one: 1 } },
      }
    );

    const newProps = { one: 1, two: 2 };
    rerender({ componentName: 'Test', props: newProps });

    expect(logSpy).toHaveBeenLastCalledWith('Test updated', newProps);
  });
});

// figure out tests
