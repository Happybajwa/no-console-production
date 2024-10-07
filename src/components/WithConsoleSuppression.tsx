import React, { useEffect, useRef } from 'react';

export type ConsoleType = "log" | "warn" | "error" | "debug" | "info";

interface ConsoleSuppressionProps {
  children: React.ReactNode;
  suppress?: ConsoleType[];
  suppressAllInDev?: boolean;
  suppressAllInProd?: boolean;
}

export const WithConsoleSuppression: React.FC<ConsoleSuppressionProps> = ({
  children,
  suppress = [],
  suppressAllInDev: suppressInDev = false,
  suppressAllInProd: suppressInProd = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (suppressInDev || suppressInProd) {
    suppress = ["log", "warn", "error", "debug", "info"];
  }

  const shouldSuppress =
    (suppressInDev && isDevelopment) ||
    (suppressInProd && !isDevelopment) ||
    suppress.length > 0;

  const originalConsole = useRef({
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    info: console.info,
  });

  if (shouldSuppress) {
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
  }

  // Restore console methods on unmount
  useEffect(() => {
    return () => {
      console.log = originalConsole.current.log;
      console.warn = originalConsole.current.warn;
      console.error = originalConsole.current.error;
      console.debug = originalConsole.current.debug;
      console.info = originalConsole.current.info;
    };
  }, []);

  return <>{children}</>;
};