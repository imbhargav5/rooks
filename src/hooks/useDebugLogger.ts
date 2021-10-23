import { useEffect, useMemo } from "react";

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Drop in replacement for javascript console but it is reactive.
 *
 * It also automatically silences all logs when in production.
 *
 * @param {unknown} levelMaybe optional, if this is one of the Console log levels then it will change the underlying console method
 * @param {...unknown[]} args any arguments to watch and log on changes
 */
const useDebugLogger = (levelMaybe: unknown, ...args: unknown[]): void => {
  const loggerArgs = useMemo(() => {
    if (console[typeof levelMaybe === "string" ? levelMaybe : ""]) {
      return args;
    }

    return [levelMaybe, ...args];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelMaybe, isDevelopment ? JSON.stringify(args) : undefined]);

  useEffect(() => {
    if (!isDevelopment) {
      return;
    }

    const logger =
      console[typeof levelMaybe === "string" ? levelMaybe : ""] || console.log;

    logger(...loggerArgs);
  }, [levelMaybe, loggerArgs]);
};

export { useDebugLogger };
