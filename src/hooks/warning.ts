const isDevelopmentEnvironment = process.env.NODE_ENV !== "production";

// eslint-disable-next-line import/no-mutable-exports
let warning: Function = function () {};

if (isDevelopmentEnvironment) {
  const printWarning = function printWarning(...actualMessage) {
    const message = `Warning: ${actualMessage}`;
    if (typeof console !== "undefined") {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the call site that caused this warning to fire.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch {}
  };

  warning = function (condition: boolean, actualMessage) {
    if (!condition) {
      printWarning(actualMessage);
    }
  };
}

export { warning };
