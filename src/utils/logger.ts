const methods = ["log", "info", "warn", "error", "debug", "exception"] as const;
type Methods = typeof methods[number];

function consoleWrap(method: Methods) {
  return function (...args) {
    if (process.env.NODE_ENV !== "production") {
      console[method](...args);
    }
  };
}

const logger: Record<Methods, (...args) => void> = {
  debug: consoleWrap("debug"),
  error: consoleWrap("error"),
  exception: consoleWrap("exception"),
  info: consoleWrap("info"),
  log: consoleWrap("log"),
  warn: consoleWrap("warn"),
};

export default logger;
