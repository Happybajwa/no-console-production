/**
 * @fileoverview TypeScript declarations for no-console-production
 * @version 3.1.0
 */

// Re-export all types and functions from the main entry point
export * from './index';

// Ensure compatibility with CommonJS
declare module 'no-console-production' {
  export * from './index';
}
