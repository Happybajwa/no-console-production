// src/index.d.ts - v3.0.0
declare module "no-console-production" {
    import { ReactNode } from 'react';

    export type ConsoleMethod = "log" | "warn" | "error" | "debug" | "info";

    interface ConsoleSuppressionOptions {
        methods?: ConsoleMethod[];
        suppressAllInDev?: boolean;
        suppressAllInProd?: boolean;
        preserveErrors?: boolean;
    }

    interface UseConsoleSuppressionOptions extends ConsoleSuppressionOptions {
        enabled?: boolean;
    }

    interface ConsoleSuppressionProviderProps extends UseConsoleSuppressionOptions {
        children: ReactNode;
    }

    /**
     * Suppresses console methods based on environment and configuration
     * @param options Configuration options for console suppression
     * @returns Cleanup function to restore console methods
     */
    export const suppressConsole: (options?: ConsoleSuppressionOptions) => (() => void);

    /**
     * Restores original console methods
     */
    export const restoreConsole: () => void;

    /**
     * Check if console suppression is currently active
     * @returns True if suppression is active, false otherwise
     */
    export const isConsoleSuppressionActive: () => boolean;

    /**
     * Get list of currently suppressed console methods
     * @returns Array of suppressed console methods
     */
    export const getSuppressedMethods: () => ConsoleMethod[];

    /**
     * React hook for console suppression with automatic cleanup
     * @param options Configuration options for console suppression
     */
    export const useConsoleSuppression: (options?: UseConsoleSuppressionOptions) => void;

    /**
     * React component that provides console suppression for its children
     */
    export const ConsoleSuppressionProvider: (props: ConsoleSuppressionProviderProps) => JSX.Element;
}
