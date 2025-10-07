/**
 * @fileoverview React provider component for console suppression
 * @version 4.0.0
 */

import React, { ReactNode } from "react";
import { useConsoleSuppression } from "../hooks/useConsoleSuppression";
import type { ConsoleConfig } from "../types/console.types";

interface ConsoleSuppressionProviderProps {
  children: ReactNode;
  config: ConsoleConfig | ConsoleConfig[];
}

/**
 * React component that provides console suppression for its children
 * Lightweight wrapper around useConsoleSuppression hook
 *
 * @example
 * <ConsoleSuppressionProvider config={{ url: 'myapp.com', enable: true }}>
 *   <App />
 * </ConsoleSuppressionProvider>
 *
 * @example
 * <ConsoleSuppressionProvider config={[
 *   { url: 'myapp.com', enable: true },
 *   { url: 'localhost', enable: false }
 * ]}>
 *   <App />
 * </ConsoleSuppressionProvider>
 */
export const ConsoleSuppressionProvider = ({
  children,
  config,
}: ConsoleSuppressionProviderProps) => {
  useConsoleSuppression(config);

  // Just render children - no wrapper div to avoid DOM pollution
  return <>{children}</>;
};
