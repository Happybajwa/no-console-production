/**
 * @fileoverview Console method utilities
 * @version 4.0.0
 */

import type { ConsoleMethod } from "../types/console.types";

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
 * Validates if a console method exists and is callable
 * @param method - Console method to validate
 * @returns true if method exists and is callable
 */
export const isValidConsoleMethod = (method: ConsoleMethod): boolean => {
    return typeof console[method] === "function";
};
