import { useEffect, useRef } from 'react';
import { suppressConsole } from '../core/console-suppression';
import type { ConsoleSuppressionOptions, ConsoleMethod } from '../types/console.types';

interface UseConsoleSuppressionOptions extends ConsoleSuppressionOptions {
  /**
   * Whether to enable console suppression
   * @default true
   */
  enabled?: boolean;
}

/**
 * React hook for console suppression with automatic cleanup
 * @param options Configuration options for console suppression
 */
export const useConsoleSuppression = ({
  methods = [],
  suppressAllInDev = false,
  suppressAllInProd = true,
  preserveErrors = true,
  enabled = true,
}: UseConsoleSuppressionOptions = {}) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) {
      // If disabled and we have an active suppression, clean it up
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }

    // Apply suppression
    cleanupRef.current = suppressConsole({
      methods,
      suppressAllInDev,
      suppressAllInProd,
      preserveErrors,
    });

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [methods, suppressAllInDev, suppressAllInProd, preserveErrors, enabled]);

  // Also cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
};
