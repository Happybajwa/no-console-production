/**
 * @fileoverview Console method management utilities
 */

import type { ConsoleMethod, ConsoleSuppressionOptions } from "../types/console.types";

/**
 * Default console methods that can be suppressed
 */
export const DEFAULT_CONSOLE_METHODS: readonly ConsoleMethod[] = [
  "log",
  "warn", 
  "error",
  "debug",
  "info"
] as const;

/**
 * Console methods excluding errors (for preserveErrors option)
 */
export const NON_ERROR_CONSOLE_METHODS: readonly ConsoleMethod[] = [
  "log",
  "warn",
  "debug", 
  "info"
] as const;

/**
 * Determines which console methods should be suppressed based on configuration
 * @param options - Console suppression options
 * @param isDevelopment - Whether current environment is development
 * @returns Array of console methods to suppress
 */
export const getMethodsToSuppress = (
  options: ConsoleSuppressionOptions,
  isDevelopment: boolean
): ConsoleMethod[] => {
  const { methods, suppressAllInDev, suppressAllInProd, preserveErrors } = options;

  // If specific methods are provided, use them (overrides all other settings)
  if (methods && methods.length > 0) {
    return methods;
  }

  // Check if we should suppress based on environment
  const shouldSuppressInCurrentEnv =
    (isDevelopment && suppressAllInDev) ||
    (!isDevelopment && suppressAllInProd);

  if (!shouldSuppressInCurrentEnv) {
    return [];
  }

  // Return appropriate method list based on preserveErrors setting
  return preserveErrors 
    ? [...NON_ERROR_CONSOLE_METHODS]
    : [...DEFAULT_CONSOLE_METHODS];
};

/**
 * Validates if a console method exists and is callable
 * @param method - Console method to validate
 * @returns true if method exists and is callable
 */
export const isValidConsoleMethod = (method: ConsoleMethod): boolean => {
  return typeof console[method] === "function";
};
