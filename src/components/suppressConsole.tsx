// src/consoleSuppression.ts
export type ConsoleMethod = "log" | "warn" | "error" | "debug" | "info";

interface ConsoleSuppressionOptions {
  methods?: ConsoleMethod[];
  suppressAllInDev?: boolean;
  suppressAllInProd?: boolean;
  preserveErrors?: boolean; // Keep errors even in production
}

// Singleton pattern to prevent multiple suppressions
let isSuppressionActive = false;
let originalMethods: Partial<Console> = {};
let suppressedMethods: Set<ConsoleMethod> = new Set();

/**
 * Suppresses console methods based on environment and configuration
 * @param options Configuration options for console suppression
 * @returns Cleanup function to restore console methods
 */
export const suppressConsole = ({
  methods = [],
  suppressAllInDev = false,
  suppressAllInProd = true,
  preserveErrors = true, // Safe default: keep errors
}: ConsoleSuppressionOptions = {}): (() => void) => {
  // Early return if already suppressed to prevent performance overhead
  if (isSuppressionActive) {
    return restoreConsole;
  }

  // Environment detection with fallback
  const isDevelopment =
    typeof process !== "undefined"
      ? process.env.NODE_ENV === "development"
      : false;

  // Determine which methods to suppress
  let methodsToSuppress: ConsoleMethod[] = [];

  if (suppressAllInDev && isDevelopment) {
    methodsToSuppress = preserveErrors
      ? ["log", "warn", "debug", "info"]
      : ["log", "warn", "error", "debug", "info"];
  } else if (suppressAllInProd && !isDevelopment) {
    methodsToSuppress = preserveErrors
      ? ["log", "warn", "debug", "info"]
      : ["log", "warn", "error", "debug", "info"];
  } else if (methods.length > 0) {
    // Apply preserveErrors to custom methods as well
    methodsToSuppress = preserveErrors
      ? methods.filter((method) => method !== "error") // Remove 'error' if preserving
      : methods; // Use all specified methods
  }

  // Early return if nothing to suppress
  if (methodsToSuppress.length === 0) {
    return () => {}; // No-op cleanup function
  }

  // Store original methods before suppression
  methodsToSuppress.forEach((method) => {
    if (console[method]) {
      originalMethods[method] = console[method];
      suppressedMethods.add(method);
      // Use empty function with minimal overhead
      (console as any)[method] = () => {};
    }
  });

  isSuppressionActive = true;

  // Return cleanup function instead of using beforeunload
  return restoreConsole;
};

/**
 * Restores original console methods
 */
export const restoreConsole = (): void => {
  if (!isSuppressionActive) return;

  // Restore original methods
  suppressedMethods.forEach((method) => {
    if (originalMethods[method]) {
      (console as any)[method] = originalMethods[method];
    }
  });

  // Reset state
  originalMethods = {};
  suppressedMethods.clear();
  isSuppressionActive = false;
};

/**
 * Check if console suppression is currently active
 * @returns True if suppression is active, false otherwise
 */
export const isConsoleSuppressionActive = (): boolean => {
  return isSuppressionActive;
};

/**
 * Get list of currently suppressed console methods
 * @returns Array of suppressed console methods
 */
export const getSuppressedMethods = (): ConsoleMethod[] => {
  return Array.from(suppressedMethods);
};
