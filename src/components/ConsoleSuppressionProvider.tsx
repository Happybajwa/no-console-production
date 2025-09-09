import React, { ReactNode } from 'react';
import { useConsoleSuppression } from '../hooks/useConsoleSuppression';
import type { ConsoleSuppressionOptions } from '../types/console.types';

interface ConsoleSuppressionProviderProps extends ConsoleSuppressionOptions {
  children: ReactNode;
  /**
   * Whether to enable console suppression
   * @default true
   */
  enabled?: boolean;
}

/**
 * React component that provides console suppression for its children
 * Lightweight wrapper around useConsoleSuppression hook
 */
export const ConsoleSuppressionProvider = ({
  children,
  methods,
  suppressAllInDev = false,
  suppressAllInProd = true,
  preserveErrors = true,
  enabled = true,
}: ConsoleSuppressionProviderProps) => {
  useConsoleSuppression({
    methods,
    suppressAllInDev,
    suppressAllInProd,
    preserveErrors,
    enabled,
  });

  // Just render children - no wrapper div to avoid DOM pollution
  return <>{children}</>;
};
