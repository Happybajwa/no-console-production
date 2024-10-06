# No Console Production

A React component to suppress console logs, warnings, errors, and debug messages in production or specific components.

## Installation

Install the package via npm or yarn:

```bash
npm install no-console-production
```


or


```bash
yarn add no-console-production
```

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
const suppressedMethods: ConsoleType[] = ['log', 'warn', 'error'];

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

- **`suppress?: ConsoleType[]`**: An optional array of console methods to suppress. The options are:
  - `"log"`
  - `"warn"`
  - `"error"`
  - `"debug"`
  - `"info"`

If not provided, all console methods will be suppressed.

## License

MIT
