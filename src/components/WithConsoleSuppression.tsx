import React, { useEffect, useRef } from "react";
import { ConsoleType } from "../interface/ConsoleType";


interface ConsoleSuppressionProps {
  children: React.ReactNode;
  suppress?: ConsoleType[];
}

export const WithConsoleSuppression: React.FC<ConsoleSuppressionProps> = ({
  children,
  suppress,
}) => {
  // Store original console methods to restore later
  const originalConsole = useRef({
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    info: console.info,
  });

  if (suppress?.length === 0 || !suppress) {
    suppress = ["log", "warn", "error", "debug"];
  }

  // Immediately override console methods when component mounts
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

  // Cleanup effect to restore original console methods on unmount
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



