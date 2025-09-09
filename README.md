# 🚫 No Console Production

**Clean console logs from production automatically. Keep your app fast and secure.**

[![npm version](https://img.shields.io/npm/v/no-console-production.svg)](https://www.npmjs.com/package/no-console-production)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/bundle-1.5KB-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)]()
[![Security](https://img.shields.io/badge/vulnerabilities-0-success.svg)]()

## 📦 Bundle Size & Performance

- **Main Bundle**: ~1.5KB minified 
- **Gzipped**: ~800 bytes
- **Runtime Dependencies**: 0 
- **Startup Overhead**: ~0.1ms
- **Memory Footprint**: <1KB

## Why?

- 🚀 **Better Performance** - Remove console logs that slow down production
- 🔒 **Security** - Hide debug information from users  
- 🧹 **Clean Console** - No clutter for end users
- 🛠️ **Keep Errors** - Still see important errors for monitoring
- ⚡ **Zero Dependencies** - No bloat, no security vulnerabilities## Install

```bash
npm install no-console-production
```

## Quick Start

```javascript
import { suppressConsole } from "no-console-production";

// One line setup - works automatically
suppressConsole();

// Your code works normally
console.log("Debug info"); // ❌ Hidden in production
console.warn("Warning"); // ❌ Hidden in production
console.error("Real error"); // ✅ Still visible (for monitoring)
```

**That's it!** In development, you see everything. In production, only errors show.

## Advanced Usage

### Custom Settings

```javascript
// Suppress specific methods only
suppressConsole({
  methods: ["log", "debug"],
});

// Suppress everything including errors
suppressConsole({
  preserveErrors: false,
});

// Force suppression in development too
suppressConsole({
  suppressAllInDev: true,
});
```

### React Hook

```javascript
import { useConsoleSuppression } from "no-console-production";

function MyApp() {
  useConsoleSuppression(); // Auto cleanup when component unmounts

  return <div>My App</div>;
}
```

### React Provider

```javascript
import { ConsoleSuppressionProvider } from "no-console-production";

function App() {
  return (
    <ConsoleSuppressionProvider>
      <MyEntireApp />
    </ConsoleSuppressionProvider>
  );
}
```

### Manual Control

```javascript
import { suppressConsole, restoreConsole } from "no-console-production";

// Start suppression
const cleanup = suppressConsole();

// Your app code...

// Stop suppression (optional - auto cleanup on page reload)
cleanup();
// or
restoreConsole();
```

## How It Works

**Development (`NODE_ENV=development`)**

- All console methods work normally
- You see all your debug logs

**Production (any other `NODE_ENV`)**

- `console.log`, `console.warn`, `console.debug`, `console.info` → Hidden
- `console.error` → Still visible (for error monitoring)

**Browser Environment**

- Treated as production (safe default)

## TypeScript

Full TypeScript support included:

```typescript
import {
  suppressConsole,
  ConsoleSuppressionOptions,
} from "no-console-production";

const options: ConsoleSuppressionOptions = {
  methods: ["log", "warn"],
  preserveErrors: true,
};

suppressConsole(options);
```

## API

### `suppressConsole(options?)`

```typescript
interface ConsoleSuppressionOptions {
  methods?: ("log" | "warn" | "error" | "debug" | "info")[];
  suppressAllInDev?: boolean; // Default: false
  suppressAllInProd?: boolean; // Default: true
  preserveErrors?: boolean; // Default: true
}
```

### `restoreConsole()`

Restores all original console methods.

### `isConsoleSuppressionActive()`

Returns `true` if suppression is currently active.

### React Components

- `useConsoleSuppression(options?)` - Hook with auto cleanup
- `<ConsoleSuppressionProvider>` - Provider component

## Requirements

- **Node.js** 14+ (for build tools)
- **Browser** - All modern browsers
- **React** 16.8+ (optional, for React features)

## License

MIT

---

**Made with ❤️ for cleaner production apps**
