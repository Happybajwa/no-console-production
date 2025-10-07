/**
 * @fileoverview Core console suppression functionality
 * @version 4.0.0
 */

import type {
    ConsoleMethod,
    ConsoleConfig,
    RestoreFunction
} from "../types/console.types";

/**
 * Default console methods
 */
const ALL_METHODS: readonly ConsoleMethod[] = ['log', 'warn', 'error', 'debug', 'info'] as const;
const NON_ERROR_METHODS: readonly ConsoleMethod[] = ['log', 'warn', 'debug', 'info'] as const;

/**
 * Stores original console methods for restoration
 */
let originalMethods: Partial<Record<ConsoleMethod, typeof console.log>> = {};
let isSuppressionActive = false;

/**
 * Reusable no-op function for better performance
 */
const noop = function () { };

/**
 * Get current hostname (browser only)
 */
function getCurrentHostname(): string {
    if (typeof window !== 'undefined' && window.location) {
        return window.location.hostname;
    }
    return '';
}

/**
 * Check if current URL matches the rule URL
 */
function matchesUrl(currentHost: string, ruleUrl: string): boolean {
    if (!currentHost || !ruleUrl) return false;

    // Normalize both URLs
    const cleanCurrent = currentHost.toLowerCase().replace(/^www\./, '');
    const cleanRule = ruleUrl.toLowerCase()
        .replace(/^https?:\/\//, '')  // Remove protocol
        .replace(/^www\./, '')         // Remove www.
        .replace(/:\d+/, '')           // Remove port number
        .replace(/\/.*$/, '')          // Remove path
        .replace(/\/$/, '');           // Remove trailing slash

    // Exact match or subdomain match
    return cleanCurrent === cleanRule || cleanCurrent.endsWith('.' + cleanRule);
}

/**
 * Determine which methods to suppress based on config
 */
function getMethodsToSuppress(config: ConsoleConfig): ConsoleMethod[] {
    const keepErrors = config.keepErrors !== undefined ? config.keepErrors : true;

    if (config.methods !== undefined) {
        // User provided explicit methods
        let methodsToSuppress = [...config.methods];

        // If keepErrors is true, remove 'error' from the list
        if (keepErrors && methodsToSuppress.includes('error')) {
            methodsToSuppress = methodsToSuppress.filter(m => m !== 'error');
        }

        return methodsToSuppress;
    }

    // No methods specified = all methods (respecting keepErrors)
    return keepErrors ? [...NON_ERROR_METHODS] : [...ALL_METHODS];
}

/**
 * Actually suppress the console methods
 */
function doSuppression(methods: ConsoleMethod[]): void {
    methods.forEach((method) => {
        if (typeof console[method] === 'function') {
            // Store original if not already stored
            if (!originalMethods[method]) {
                originalMethods[method] = console[method];
            }
            // Replace with no-op function (reuse same function for performance)
            (console as any)[method] = noop;
        }
    });
    isSuppressionActive = true;
}

/**
 * Suppress console methods based on URL matching rules
 * 
 * @param config - Single config or array of configs for URL-based suppression
 * @returns Restore function to undo suppression
 * 
 * @remarks
 * **Important Behavior:**
 * - Rules are evaluated in order
 * - **First matching URL wins** - subsequent matches are ignored
 * - If no URL matches, console is NOT suppressed (safe default)
 * - Duplicate URLs: only the first occurrence is used
 * 
 * @example
 * // Single rule
 * suppressConsole({ url: 'myapp.com', enable: true });
 * 
 * @example
 * // Multiple rules - first match wins
 * suppressConsole([
 *   { url: 'myapp.com', enable: true },
 *   { url: 'staging.myapp.com', enable: true, keepErrors: true },
 *   { url: 'localhost', enable: false }
 * ]);
 * 
 * @example
 * // Custom methods per environment
 * suppressConsole([
 *   { url: 'myapp.com', enable: true, methods: ['log', 'debug'] },
 *   { url: 'staging.myapp.com', enable: true, keepErrors: true }
 * ]);
 * 
 * @example
 * // Priority order matters - specific before general
 * suppressConsole([
 *   { url: 'dev.myapp.com', enable: false },    // Specific subdomain first
 *   { url: 'myapp.com', enable: true }          // General domain second
 * ]);
 */
export function suppressConsole(
    config: ConsoleConfig | ConsoleConfig[]
): RestoreFunction {
    // Normalize to array
    const configs = Array.isArray(config) ? config : [config];

    // Get current hostname
    const currentHost = getCurrentHostname();

    // Find first matching rule
    const matchedConfig = configs.find(cfg => matchesUrl(currentHost, cfg.url));

    // No match or explicitly disabled? Don't suppress
    if (!matchedConfig || !matchedConfig.enable) {
        return () => { }; // No-op restore function
    }

    // Don't suppress multiple times
    if (isSuppressionActive) {
        return restoreConsole;
    }

    // Determine methods to suppress
    const methodsToSuppress = getMethodsToSuppress(matchedConfig);

    // Nothing to suppress?
    if (methodsToSuppress.length === 0) {
        return () => { };
    }

    // Actually suppress
    doSuppression(methodsToSuppress);

    // Return restore function
    return restoreConsole;
}

/**
 * Restore original console methods
 * 
 * @example
 * restoreConsole();
 */
export function restoreConsole(): void {
    if (!isSuppressionActive) {
        return;
    }

    // Restore all original methods
    Object.keys(originalMethods).forEach((method) => {
        const originalMethod = originalMethods[method as ConsoleMethod];
        if (originalMethod) {
            (console as any)[method] = originalMethod;
        }
    });

    // Reset state
    originalMethods = {};
    isSuppressionActive = false;
}

/**
 * Check if console suppression is currently active
 * @returns True if suppression is active
 * 
 * @example
 * if (isConsoleSuppressionActive()) {
 *   console.log('This might be suppressed');
 * }
 */
export function isConsoleSuppressionActive(): boolean {
    return isSuppressionActive;
}

/**
 * Get list of currently suppressed console methods
 * @returns Array of suppressed console methods
 * 
 * @example
 * const suppressed = getSuppressedMethods();
 * console.log('Suppressed:', suppressed);
 */
export function getSuppressedMethods(): ConsoleMethod[] {
    return Object.keys(originalMethods) as ConsoleMethod[];
}
