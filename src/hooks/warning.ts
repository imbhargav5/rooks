const isDevelopmentEnvironment = process.env.NODE_ENV !== "production";

type Warning = (condition: boolean, message: string) => void;
type PrintWarning = (message: string) => void;

// eslint-disable-next-line import/no-mutable-exports
let warning: Warning = () => {};

if (isDevelopmentEnvironment) {
  const printWarning: PrintWarning = (actualMessage: string) => {
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

  warning = function (condition: boolean, actualMessage: string) {
    if (!condition) {
      printWarning(actualMessage);
    }
  };
}

export { warning };
