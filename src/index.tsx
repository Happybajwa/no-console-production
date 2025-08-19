import { 
  ConsoleMethod, 
  suppressConsole, 
  restoreConsole, 
  isConsoleSuppressionActive, 
  getSuppressedMethods 
} from './components/suppressConsole';
import { useConsoleSuppression } from './hooks/useConsoleSuppression';
import { ConsoleSuppressionProvider } from './components/ConsoleSuppressionProvider';

// Export all public APIs
export { 
  suppressConsole, 
  restoreConsole, 
  useConsoleSuppression, 
  ConsoleSuppressionProvider,
  isConsoleSuppressionActive,
  getSuppressedMethods
};
export type { ConsoleMethod };
