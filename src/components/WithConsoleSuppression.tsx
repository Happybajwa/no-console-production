import React, { useEffect, useRef } from "react";
import { ConsoleType } from "../interface/ConsoleType";

interface ConsoleSuppressionProps {
  children: React.ReactNode;
  suppress?: ConsoleType[];
  suppressInDev?: boolean; 
  suppressInProd?: boolean;
}

export const WithConsoleSuppression: React.FC<ConsoleSuppressionProps> = ({
  children,
  suppress,
  suppressInDev = false,
  suppressInProd = true,
}) => {
  const originalConsole = useRef({
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    info: console.info,
  });

  // Set default suppression if suppress is undefined or empty
  if (suppress?.length === 0 || !suppress) {
    suppress = ["log", "warn", "error", "debug"];
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  const shouldSuppress =
    (isDevelopment && suppressInDev) || (!isDevelopment && suppressInProd);

  useEffect(() => {
    if (!shouldSuppress) return;

    // Suppress console methods
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

    // Restore original console methods on unmount
    return () => {
      console.log = originalConsole.current.log;
      console.warn = originalConsole.current.warn;
      console.error = originalConsole.current.error;
      console.debug = originalConsole.current.debug;
      console.info = originalConsole.current.info;
    };
  }, [suppress, shouldSuppress]);
  return <>{children}</>;
};
