# 🚫 No Console Production

**Clean, URL-based console suppression for production. Simple, reliable, and framework-agnostic.**

[![npm version](https://img.shields.io/npm/v/no-console-production.svg)](https://www.npmjs.com/package/no-console-production)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/bundle-~1KB-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)]()

## ✨ What's New in v4.0.0

🎯 **Major Simplification!**

- ✅ **URL-based suppression** - No more unreliable environment detection
- ✅ **You control when** - Explicit configuration, no magic
- ✅ **Works everywhere** - CRA, Vite, Next.js, vanilla JS
- ✅ **Simpler API** - Less code, more clarity
- ✅ **Per-URL configs** - Different rules for staging, production, dev

🚨 **Breaking Changes from v3.x**

- Removed environment auto-detection (`NODE_ENV` is unreliable)
- New config-based API (much simpler!)
- See [Migration Guide](#-migrating-from-v3x) below

---

## 🤔 Why This Approach?

### **The Problem with v3.x (Environment Detection)**

Many users reported console logs **still appearing in production** despite using the library. Here's why:

#### **1. Bundlers Handle `NODE_ENV` Differently**

```javascript
// In your code
suppressConsole(); // Expected to work in production

// But internally, library checks:
const nodeEnv = process.env.NODE_ENV; // ❌ Problem!
```

**What happens:**
- **Webpack/CRA**: Replaces `process.env.NODE_ENV` at **build time** with string literal
- **Vite**: Uses `import.meta.env.MODE` instead of `process.env.NODE_ENV`
- **Next.js**: Different behavior in client vs server
- **Parcel**: May not inject `NODE_ENV` at all
- **Browser runtime**: `process.env` might be `undefined`

#### **2. Real User Issues**

> "I'm using this in CRA production build and still seeing console.log statements!" - User #1

> "Doesn't work in Vite - process.env.NODE_ENV is undefined" - User #2

> "Works in webpack but not in my custom rollup setup" - User #3

#### **3. The Solution: URL-Based Detection**

**100% reliable across ALL environments:**
- ✅ Works in any bundler (webpack, Vite, Parcel, esbuild, Rollup)
- ✅ Works in vanilla JS (no bundler)
- ✅ Works in SSR/SSG (Next.js, Remix, etc.)
- ✅ **You control it** - no guessing, no magic
- ✅ Runtime detection - always accurate

```javascript
// Just specify your production domain
suppressConsole({ url: 'myapp.com', enable: true });

// Works on myapp.com ✅
// Doesn't work on localhost ✅
// No bundler configuration needed ✅
```

---

## 📦 Why Use This?

- 🚀 **Better Performance** - Remove console logs that slow down production
- 🔒 **Security** - Hide debug information from users
- 🧹 **Clean Console** - No clutter for end users
- 🛠️ **Keep Errors** - Still see important errors for monitoring (optional)
- ⚡ **Zero Dependencies** - No bloat, no vulnerabilities
- 🎯 **Reliable** - No broken environment detection

---

## 📥 Install

```bash
npm install no-console-production
```

---

## 🚀 Quick Start

### Simple Setup (Recommended)

```javascript
import { suppressConsole } from "no-console-production";

// Suppress console on your production domain
suppressConsole({
  url: "myapp.com",
  enable: true,
});
```

**That's it!** Works on `myapp.com` and all subdomains (`*.myapp.com`).

---

## 📖 Usage Examples

### Multiple Environments

```javascript
import { suppressConsole } from "no-console-production";

suppressConsole([
  { url: "myapp.com", enable: true }, // Production
  { url: "staging.myapp.com", enable: true }, // Staging
  { url: "preprod.myapp.com", enable: true }, // Pre-production
  { url: "localhost", enable: false }, // Development
]);
```

### Custom Methods Per Environment

```javascript
suppressConsole([
  {
    url: "myapp.com",
    enable: true,
    // methods undefined = suppress all (except errors)
  },
  {
    url: "staging.myapp.com",
    enable: true,
    methods: ["log", "debug"], // Only suppress these
    keepErrors: true, // Keep console.error
  },
  {
    url: "localhost",
    enable: false, // Keep all console methods
  },
]);
```

### Suppress Everything (Including Errors)

```javascript
suppressConsole({
  url: "myapp.com",
  enable: true,
  keepErrors: false, // Suppress console.error too
});
```

### React Hook

```javascript
import { useConsoleSuppression } from "no-console-production";

function App() {
  useConsoleSuppression([
    { url: "myapp.com", enable: true },
    { url: "localhost", enable: false },
  ]);

  return <div>My App</div>;
}
```

### React Provider

```javascript
import { ConsoleSuppressionProvider } from "no-console-production";

function Root() {
  return (
    <ConsoleSuppressionProvider
      config={[
        { url: "myapp.com", enable: true },
        { url: "localhost", enable: false },
      ]}
    >
      <App />
    </ConsoleSuppressionProvider>
  );
}
```

---

## 📚 API Reference

### `suppressConsole(config)`

Main function to suppress console methods based on URL rules.

```typescript
function suppressConsole(
  config: ConsoleConfig | ConsoleConfig[]
): RestoreFunction;
```

#### `ConsoleConfig` Interface

```typescript
interface ConsoleConfig {
  url: string; // URL/hostname to match
  enable: boolean; // Enable suppression on this URL
  methods?: ConsoleMethod[]; // Optional: specific methods to suppress
  keepErrors?: boolean; // Optional: keep console.error (default: true)
}

type ConsoleMethod = "log" | "warn" | "error" | "debug" | "info";
```

#### Parameters

| Property     | Type              | Required | Default     | Description                                |
| ------------ | ----------------- | -------- | ----------- | ------------------------------------------ |
| `url`        | `string`          | ✅ Yes   | -           | Hostname to match (e.g., 'myapp.com')      |
| `enable`     | `boolean`         | ✅ Yes   | -           | Enable or disable suppression              |
| `methods`    | `ConsoleMethod[]` | ❌ No    | All methods | Specific methods to suppress               |
| `keepErrors` | `boolean`         | ❌ No    | `true`      | Keep console.error visible (recommended)   |

#### Behavior

- **Rules are evaluated in order**
- **First matching URL wins** (subsequent matches ignored)
- **No match = no suppression** (safe default)
- **Duplicate URLs**: only first occurrence is used

#### Examples

```javascript
// Single rule
suppressConsole({ url: "myapp.com", enable: true });

// Multiple rules (first match wins)
suppressConsole([
  { url: "dev.myapp.com", enable: false }, // Specific first
  { url: "myapp.com", enable: true }, // General second
]);

// Custom methods
suppressConsole({
  url: "staging.myapp.com",
  enable: true,
  methods: ["log", "debug"],
  keepErrors: true,
});
```

### Other Functions

```typescript
// Restore original console methods
restoreConsole(): void

// Check if suppression is active
isConsoleSuppressionActive(): boolean

// Get list of suppressed methods
getSuppressedMethods(): ConsoleMethod[]
```

---

## 🔧 Framework Integration

### Create React App (CRA)

```javascript
// src/index.js
import { suppressConsole } from "no-console-production";

suppressConsole([
  { url: "myapp.com", enable: true },
  { url: "localhost", enable: false },
]);

// Rest of your CRA code...
ReactDOM.render(<App />, document.getElementById("root"));
```

### Vite

```javascript
// src/main.tsx
import { suppressConsole } from "no-console-production";

suppressConsole({ url: "myapp.com", enable: true });

// Rest of your Vite app...
createRoot(document.getElementById("root")).render(<App />);
```

### Next.js

```javascript
// pages/_app.tsx
import { suppressConsole } from "no-console-production";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    suppressConsole([
      { url: "myapp.com", enable: true },
      { url: "localhost", enable: false },
    ]);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### Vanilla JavaScript

```html
<script src="https://unpkg.com/no-console-production"></script>
<script>
  noConsoleProduction.suppressConsole({
    url: "myapp.com",
    enable: true,
  });
</script>
```

---

## 🔄 Migrating from v3.x

### Old API (v3.x)

```javascript
// ❌ Old way - environment detection
suppressConsole();
suppressConsole({ suppressAllInProd: true });
suppressConsole({ suppressAllInDev: false });
```

### New API (v4.x)

```javascript
// ✅ New way - explicit URL-based
suppressConsole({ url: "myapp.com", enable: true });

suppressConsole([
  { url: "myapp.com", enable: true },
  { url: "localhost", enable: false },
]);
```

### Migration Steps

1. **Replace environment-based config with URL-based**
2. **Specify your production domain explicitly**
3. **Add localhost rule for development**

**Before (v3.x):**

```javascript
suppressConsole({ suppressAllInProd: true });
```

**After (v4.x):**

```javascript
suppressConsole({ url: "myapp.com", enable: true });
```

---

## ❓ FAQ

### Why not use environment variables?

Environment variables (`process.env.NODE_ENV`) are unreliable in production:

- Webpack/bundlers replace them at **build time**
- Different bundlers handle them differently
- SSR/SSG apps have different behavior
- Can be `undefined` in browser runtime

**URL-based detection is 100% reliable** across all environments.

### Will this work with my bundler?

✅ **Yes!** Works with:

- Create React App (webpack)
- Vite
- Next.js
- Parcel
- Rollup
- esbuild
- Any bundler or no bundler at all

### What if my URL changes?

Just update your config! You control it explicitly.

### Does this affect error monitoring (Sentry, etc.)?

No! By default, `console.error` is preserved. Error monitoring tools will still work.

### Can I use it with server-side rendering?

Yes, but it only works in the browser. On the server, URLs don't match, so nothing is suppressed.

### What about duplicate URLs in config?

First matching URL wins. Duplicates are ignored. See [API Reference](#behavior) for details.

---

## 📄 License

MIT © Harry

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🐛 Issues

Found a bug? [Open an issue](https://github.com/Happybajwa/no-console-production/issues)

---

**Made with ❤️ for cleaner production consoles**
