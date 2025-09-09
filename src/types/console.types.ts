/**
 * @fileoverview Type definitions for console suppression functionality
 */

/**
 * Available console methods that can be suppressed
 */
export type ConsoleMethod = "log" | "warn" | "error" | "debug" | "info";

/**
 * Configuration options for console suppression
 */
export interface ConsoleSuppressionOptions {
  /**
   * Specific console methods to suppress. When provided, overrides all other settings.
   * @example ["log", "warn"] - Only suppress log and warn
   */
  methods?: ConsoleMethod[];
  
  /**
   * Whether to suppress console methods in development environment
   * @default false
   */
  suppressAllInDev?: boolean;
  
  /**
   * Whether to suppress console methods in production environment
   * @default true
   */
  suppressAllInProd?: boolean;
  
  /**
   * Whether to preserve error messages even when suppressing other methods
   * @default true - Recommended for debugging
   */
  preserveErrors?: boolean;
}

/**
 * Console suppression state interface
 */
export interface ConsoleSuppressionState {
  isActive: boolean;
  suppressedMethods: Set<ConsoleMethod>;
  originalMethods: Partial<Console>;
}

/**
 * Function type for restoring console methods
 */
export type RestoreFunction = () => void;

/**
 * Environment detection result
 */
export interface Environment {
  isDevelopment: boolean;
  nodeEnv: string | undefined;
}
