/**
 * @fileoverview Core console suppression functionality
 * @version 3.1.0
 */

import type {
    ConsoleMethod,
    ConsoleSuppressionOptions,
    ConsoleSuppressionState,
    RestoreFunction
} from "../types/console.types";
import { detectEnvironment } from "../utils/environment";
import { getMethodsToSuppress, isValidConsoleMethod } from "../utils/console-methods";

/**
 * Singleton state for console suppression
 * Prevents multiple suppressions and maintains original console methods
 */
class ConsoleSuppressionManager {
    private state: ConsoleSuppressionState = {
        isActive: false,
        suppressedMethods: new Set<ConsoleMethod>(),
        originalMethods: {},
    };

    /**
     * Suppresses console methods based on environment and configuration
     * @param options - Configuration options for console suppression
     * @returns Cleanup function to restore console methods
     */
    public suppress(options: ConsoleSuppressionOptions = {}): RestoreFunction {
        // Early return if already suppressed to prevent performance overhead
        if (this.state.isActive) {
            return this.restore.bind(this);
        }

        // Set default values
        const config: Required<ConsoleSuppressionOptions> = {
            methods: [],
            suppressAllInDev: false,
            suppressAllInProd: true,
            preserveErrors: true,
            ...options,
        };

        const environment = detectEnvironment();
        const methodsToSuppress = getMethodsToSuppress(config, environment.isDevelopment);

        // Early return if nothing to suppress
        if (methodsToSuppress.length === 0) {
            return () => { }; // No-op cleanup function
        }

        // Store original methods and suppress them
        this.suppressMethods(methodsToSuppress);

        // Only set suppression as active when methods are actually suppressed
        this.state.isActive = true;

        // Return cleanup function
        return this.restore.bind(this);
    }

    /**
     * Restores original console methods
     */
    public restore(): void {
        if (!this.state.isActive) {
            return;
        }

        // Restore original methods
        this.state.suppressedMethods.forEach((method) => {
            const originalMethod = this.state.originalMethods[method];
            if (originalMethod) {
                (console as any)[method] = originalMethod;
            }
        });

        // Reset state
        this.resetState();
    }

    /**
     * Check if console suppression is currently active
     * @returns True if suppression is active, false otherwise
     */
    public isActive(): boolean {
        return this.state.isActive;
    }

    /**
     * Get list of currently suppressed console methods
     * @returns Array of suppressed console methods
     */
    public getSuppressedMethods(): ConsoleMethod[] {
        return Array.from(this.state.suppressedMethods);
    }

    /**
     * Suppresses the specified console methods
     * @param methods - Methods to suppress
     */
    private suppressMethods(methods: ConsoleMethod[]): void {
        methods.forEach((method) => {
            if (isValidConsoleMethod(method)) {
                // Store original method
                this.state.originalMethods[method] = console[method];
                this.state.suppressedMethods.add(method);

                // Replace with empty function for minimal overhead
                (console as any)[method] = () => { };
            }
        });
    }

    /**
     * Resets the internal state
     */
    private resetState(): void {
        this.state.originalMethods = {};
        this.state.suppressedMethods.clear();
        this.state.isActive = false;
    }
}

// Create singleton instance
const consoleSuppressionManager = new ConsoleSuppressionManager();

/**
 * Suppresses console methods based on environment and configuration
 * @param options - Configuration options for console suppression
 * @returns Cleanup function to restore console methods
 * 
 * @example
 * ```typescript
 * // Suppress all console methods in production only
 * const restore = suppressConsole();
 * 
 * // Suppress specific methods
 * const restore = suppressConsole({ methods: ['log', 'warn'] });
 * 
 * // Suppress in development too
 * const restore = suppressConsole({ suppressAllInDev: true });
 * 
 * // Restore when needed
 * restore();
 * ```
 */
export const suppressConsole = (options?: ConsoleSuppressionOptions): RestoreFunction => {
    return consoleSuppressionManager.suppress(options);
};

/**
 * Restores original console methods
 * 
 * @example
 * ```typescript
 * restoreConsole();
 * ```
 */
export const restoreConsole = (): void => {
    consoleSuppressionManager.restore();
};

/**
 * Check if console suppression is currently active
 * @returns True if suppression is active, false otherwise
 * 
 * @example
 * ```typescript
 * if (isConsoleSuppressionActive()) {
 *   console.log('This will not appear');
 * }
 * ```
 */
export const isConsoleSuppressionActive = (): boolean => {
    return consoleSuppressionManager.isActive();
};

/**
 * Get list of currently suppressed console methods
 * @returns Array of suppressed console methods
 * 
 * @example
 * ```typescript
 * const suppressed = getSuppressedMethods();
 * console.log('Suppressed methods:', suppressed);
 * ```
 */
export const getSuppressedMethods = (): ConsoleMethod[] => {
    return consoleSuppressionManager.getSuppressedMethods();
};
