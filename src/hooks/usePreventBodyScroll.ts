import { useIsomorphicEffect } from './useIsomorphicEffect';

type Options = {
  when: boolean;
};

const defaultOptions = {
  when: true,
};

/**
 * usePreventBodyScroll hook
 * A react hook to prevent body scroll. Optionally takes a condition when which disables body scroll only when the condition is true.
 *
 * @param when A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns null
 */
const usePreventBodyScroll = (options: Options = defaultOptions) => {
  const { when } = options;

  useIsomorphicEffect(() => {
    if (when && typeof document !== 'undefined' && document?.body?.style)
      document.body.setAttribute('style', 'overflow: hidden');

    return () => {
      if (document?.body?.style)
        document.body.setAttribute('style', 'overflow: scroll');
    };
  }, [when]);

  return null;
};

export { usePreventBodyScroll };
