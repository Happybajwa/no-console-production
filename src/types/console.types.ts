/**
 * @fileoverview Type definitions for console suppression functionality
 * @version 4.0.0
 */

/**
 * Available console methods that can be suppressed
 */
export type ConsoleMethod = "log" | "warn" | "error" | "debug" | "info";

/**
 * Configuration for URL-based console suppression
 */
export interface ConsoleConfig {
  /**
   * URL/hostname to match (e.g., 'myapp.com', 'staging.myapp.com')
   * Matches exact domain and subdomains
   * @example 'myapp.com' - Matches myapp.com and *.myapp.com
   */
  url: string;
  
  /**
   * Enable or disable suppression for this URL
   * @example true - Suppress console on this URL
   * @example false - Don't suppress console on this URL
   */
  enable: boolean;
  
  /**
   * Specific console methods to suppress
   * - undefined: Suppress all methods (respecting preserveErrors)
   * - []: Suppress nothing
   * - ['log', 'debug']: Suppress only these methods
   * @default undefined (all methods)
   */
  methods?: ConsoleMethod[];
  
  /**
   * Keep console.error working even when suppressing other methods
   * - true: Never suppress console.error (recommended for production monitoring)
   * - false: Allow suppressing console.error
   * @default true
   */
  keepErrors?: boolean;
}

/**
 * Function type for restoring console methods
 */
export type RestoreFunction = () => void;
