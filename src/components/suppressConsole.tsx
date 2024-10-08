// src/consoleSuppression.ts
export type ConsoleType = "log" | "warn" | "error" | "debug" | "info";

interface ConsoleSuppressionOptions {
  suppress?: ConsoleType[];
  suppressAllInDev?: boolean;
  suppressAllInProd?: boolean;
}

export const suppressConsole = ({
  suppress = [],
  suppressAllInDev = false,
  suppressAllInProd = true,
}: ConsoleSuppressionOptions = {}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  let shouldSuppress = false;

  if (suppressAllInDev && isDevelopment) {
    shouldSuppress = true;
    suppress = ["log", "warn", "error", "debug", "info"];
  } else if (suppressAllInProd && !isDevelopment) {
    shouldSuppress = true;
    suppress = ["log", "warn", "error", "debug", "info"];
  } else if (suppress.length > 0) {
    shouldSuppress = true;
  }

  if (shouldSuppress) {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info,
    };

    // Override console methods as per the `suppress` array
    suppress.forEach((type) => {
      switch (type) {
        case "log":
          console.log = () => {};
          break;
        case "warn":
          console.warn = () => {};
          break;
        case "error":
          console.error = () => {};
          break;
        case "debug":
          console.debug = () => {};
          break;
        case "info":
          console.info = () => {};
          break;
        default:
          break;
      }
    });

    // Restore original console methods on unmount or cleanup
    window.addEventListener("beforeunload", () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.debug = originalConsole.debug;
      console.info = originalConsole.info;
    });
  }
};
