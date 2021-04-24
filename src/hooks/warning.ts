const __DEV__ = process.env.NODE_ENV !== 'production';

let warning: Function = function () {};

if (__DEV__) {
  const printWarning = function printWarning(...actualMessage) {
    const message = `Warning: ${actualMessage}`;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch {}
  };

  warning = function (condition: boolean, actualMessage) {
    if (!condition) {
      printWarning(actualMessage);
    }
  };
}

export { warning };
