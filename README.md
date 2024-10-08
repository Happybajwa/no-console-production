# 🚫🖥️ No Console Production

A React component to **suppress** console logs, warnings, errors, and debug messages in production or specific components.

## 📦 Installation

Install the package via **npm**, **yarn**, or **bun**:

```bash
    ⬇️ npm install no-console-production
```
```
    ⬇️ yarn add no-console-production
```
```
    ⬇️ bun add no-console-production
```


    ```
## How it works

**Environment Detection**: The utility first determines whether the current environment is development by checking the value of `process.env.NODE_ENV`. This is used to conditionally apply console suppression based on the `suppressAllInDev` and `suppressAllInProd` flags.

### ⚙️ Condition for Suppression

The logic to suppress console methods depends on three key factors:

- 🛑 **If `suppressAllInDev` is `true`** and the environment is development, all console methods are suppressed.
- 🛑 **If `suppressAllInProd` is `true`** and the environment is production, all console methods are suppressed.
- 📝 **If `suppress` is provided** and contains console methods to suppress, only the specified methods are suppressed.
- 🔄 When either `suppressAllInDev` or `suppressAllInProd` is set to true, the `suppress` array is automatically overridden to suppress all console methods (`log`, `warn`, `error`, `debug`, `info`).

### 🔕 Suppress All Except Errors

✨ If you want to suppress all console methods except errors, you can pass all other methods in the `suppress` array and leave out `"error"`. This will ensure that only `console.error` is logged in any environment, while all other console outputs are suppressed.

---

### ⚙️ Props

- **`suppress`** *(optional)*: An array of console methods to suppress. If `suppressAllInDev` (for development) or `suppressAllInProd` (for production) is set to true, all console methods (`log`, `warn`, `error`, `debug`, `info`) will be suppressed. If neither is true and no `suppress` array is provided, nothing will be suppressed by default. If specific console methods are passed in the `suppress` array (e.g., `['warn', 'error']`), only those methods will be suppressed.

- **`suppressAllInDev`** *(optional)*: A boolean flag to specify whether all console outputs should be suppressed in development mode. If `true`, all console methods will be suppressed in the development environment. The default is `false`.

- **`suppressAllInProd`** *(optional)*: A boolean flag to specify whether all console outputs should be suppressed in production mode. If `true`, all console methods will be suppressed in the production environment. The default is `false`.

---

### 🛠️ Usage

Call `suppressConsole()` directly in your code to suppress console outputs:

```ts
import { suppressConsole, ConsoleType } from "no-console-production";

// Example usage in an application
const suppressedMethods: ConsoleType[] = ['log', 'warn', 'info'];

suppressConsole({
  suppress: suppressedMethods,
  suppressAllInDev: true, // suppress all in development
  suppressAllInProd: false // do not suppress all in production
});

// Now the console methods will be suppressed based on the configuration
console.log("This log will be suppressed");
console.warn("This warning will be suppressed");
console.error("This error will not be suppressed");
```
## 📜 License

MIT
