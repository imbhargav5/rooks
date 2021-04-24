import { useEffect } from 'react';

/**
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 */
function useDidMount(callback: () => any): void {
  useEffect(() => {
    if (typeof callback === 'function') {
      callback();
    }
  }, []);
}

export { useDidMount };
