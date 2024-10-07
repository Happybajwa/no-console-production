# No Console Production

A React component to suppress console logs, warnings, errors, and debug messages in production or specific components.

## Installation

Install the package via npm or yarn:

```bash
npm install no-console-production
```

```bash
yarn add no-console-production
```

```bash
bun add no-console-production
```


## Props
- suppress (optional): An array of console methods to suppress. By default, all console methods (log, warn, error, debug, info) are suppressed unless explicitly specified. If not provided, the default is ["log", "warn", "error", "debug", "info"].

- suppressAllInDev (optional): A boolean flag to specify whether all console outputs should be suppressed in development mode. If true, all console methods will be suppressed in the development environment. The default is false.

- suppressAllInProd (optional): A boolean flag to specify whether all console outputs should be suppressed in production mode. If true, all console methods will be suppressed in the production environment. The default is false.

### How It Works

- Environment Detection: The component first determines whether the current environment is development by checking the value of process.env.NODE_ENV. This is used to conditionally apply console suppression based on the suppressAllInDev and suppressAllInProd flags.

- Condition for Suppression: The logic to suppress console methods depends on three factors:

- If suppressAllInDev is true and the environment is development, all console methods are suppressed.
- If suppressAllInProd is true and the environment is production, all console methods are suppressed.
- If suppress is provided and contains console methods to suppress, only the specified methods are suppressed.
- When either suppressAllInDev or suppressAllInProd is set to true, the suppress array is automatically overridden to suppress all console methods (log, warn, error, debug, info).

### Suppress All Except Errors

If you want to suppress all console methods except errors, you can pass all other methods in the suppress array and leave out "error". This will ensure that only console.error is logged in any environment, and all other console outputs are suppressed.

## Usage

Wrap your component with `WithConsoleSuppression` to suppress console outputs:

```tsx
import { WithConsoleSuppression, ConsoleType } from "no-console-production";

const TestComponent = () => {
  console.log("This log will be suppressed");
  console.warn("This warning will be suppressed");
  console.error("This error will be suppressed");

  return <div>Test Component Running</div>;
};

// Example usage in an application
const suppressedMethods: ConsoleType[] = ['log', 'warn', 'info'];

const App = () => {
  return (
    <WithConsoleSuppression suppress={suppressedMethods}>
      <TestComponent />
    </WithConsoleSuppression>
  );
};
export default App;
```

If no value is provided for the `suppress` prop, **all console methods** (`log`, `warn`, `error`, `debug`, `info`) will be suppressed by default.

### Props
- suppress (optional): An array of console methods to suppress. By default, all console methods (log, warn, error, debug, info) are suppressed unless explicitly specified. If not provided, the default is ["log", "warn", "error", "debug", "info"].

- suppressAllInDev (optional): A boolean flag to specify whether all console outputs should be suppressed in development mode. If true, all console methods will be suppressed in the development environment. The default is false.

- suppressAllInProd (optional): A boolean flag to specify whether all console outputs should be suppressed in production mode. If true, all console methods will be suppressed in the production environment. The default is false.


## License

MIT
