/**
 * @fileoverview Environment detection utilities
 */

import type { Environment } from "../types/console.types";

/**
 * Detects the current runtime environment
 * @returns Environment information
 */
export const detectEnvironment = (): Environment => {
  const nodeEnv = typeof process !== "undefined" ? process.env.NODE_ENV : undefined;
  
  return {
    isDevelopment: nodeEnv === "development",
    nodeEnv,
  };
};

/**
 * Determines if the current environment is production
 * @returns true if in production environment
 */
export const isProduction = (): boolean => {
  return !detectEnvironment().isDevelopment;
};

/**
 * Determines if the current environment is development
 * @returns true if in development environment
 */
export const isDevelopment = (): boolean => {
  return detectEnvironment().isDevelopment;
};
