/**
 * @fileoverview Main entry point for no-console-production library
 * @version 3.1.0
 */

// Core functionality
export {
  suppressConsole,
  restoreConsole,
  isConsoleSuppressionActive,
  getSuppressedMethods,
} from "./core/console-suppression";

// React components and hooks
export { useConsoleSuppression } from "./hooks/useConsoleSuppression";
export { ConsoleSuppressionProvider } from "./components/ConsoleSuppressionProvider";

// Type exports
export type {
  ConsoleMethod,
  ConsoleSuppressionOptions,
  ConsoleSuppressionState,
  RestoreFunction,
  Environment,
} from "./types/console.types";

// Utility exports
export { detectEnvironment, isProduction, isDevelopment } from "./utils/environment";
export { 
  DEFAULT_CONSOLE_METHODS, 
  NON_ERROR_CONSOLE_METHODS,
  getMethodsToSuppress,
  isValidConsoleMethod 
} from "./utils/console-methods";
