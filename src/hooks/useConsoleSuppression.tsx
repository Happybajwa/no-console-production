/**
 * @fileoverview React hook for console suppression
 * @version 4.0.0
 */

import { useEffect, useRef } from 'react';
import { suppressConsole } from '../core/console-suppression';
import type { ConsoleConfig } from '../types/console.types';

/**
 * React hook for console suppression with automatic cleanup
 * @param config - Single config or array of configs for URL-based suppression
 * 
 * @example
 * // Single rule
 * useConsoleSuppression({ url: 'myapp.com', enable: true });
 * 
 * @example
 * // Multiple rules
 * useConsoleSuppression([
 *   { url: 'myapp.com', enable: true },
 *   { url: 'localhost', enable: false }
 * ]);
 * 
 * @example
 * // With custom methods
 * useConsoleSuppression({ 
 *   url: 'staging.myapp.com', 
 *   enable: true, 
 *   methods: ['log', 'debug'],
 *   preserveErrors: true
 * });
 */
export const useConsoleSuppression = (
  config: ConsoleConfig | ConsoleConfig[]
) => {
  const cleanupRef = useRef<(() => void) | null>(null);
  const configRef = useRef(config);

  useEffect(() => {
    // Update config ref
    configRef.current = config;

    // Apply suppression
    cleanupRef.current = suppressConsole(config);

    // Cleanup on unmount or config change
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [config]);
};
