import { useIsomorphicEffect } from './useIsomorphicEffect';

/**
 * usePreventBodyScroll hook
 * Prevent Body Scroll
 *
 * @param when A boolean which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns null
 */

type Options = {
  when: boolean;
};

const defaultOptions = {
  when: true,
};

function usePreventBodyScroll(options: Options = defaultOptions) {
  const { when } = options;

  useIsomorphicEffect(() => {
    if (when) document.body.style = 'overflow: hidden';

    return () => {
      document.body.style = 'overflow: scroll';
    };
  }, [when]);

  return null;
}

export { usePreventBodyScroll };
