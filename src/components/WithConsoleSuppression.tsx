import React, { useRef } from "react";
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
  if (!suppress || suppress.length === 0) {
    suppress = ["log", "warn", "error", "debug", "info"];
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  const shouldSuppress = isDevelopment ? suppressInDev : suppressInProd;

  // Apply suppression immediately before React renders
  if (shouldSuppress) {
    suppress.forEach((type) => {
      switch (type) {
        case "log":
          console.log = () => {}; // Suppress log
          break;
        case "warn":
          console.warn = () => {}; // Suppress warn
          break;
        case "error":
          console.error = () => {}; // Suppress error
          break;
        case "debug":
          console.debug = () => {}; // Suppress debug
          break;
        case "info":
          console.info = () => {}; // Suppress info
          break;
        default:
          break;
      }
    });
  }

  // Restore original console methods on unmount
  React.useEffect(() => {
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
