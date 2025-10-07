/**
 * @fileoverview Main entry point for no-console-production library
 * @version 4.0.0
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
  ConsoleConfig,
  RestoreFunction,
} from "./types/console.types";

// Utility exports
export { 
  DEFAULT_CONSOLE_METHODS, 
  NON_ERROR_CONSOLE_METHODS,
  isValidConsoleMethod 
} from "./utils/console-methods";
