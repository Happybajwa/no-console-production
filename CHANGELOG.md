# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] - 2025-10-08

### 🎯 Major Rewrite - URL-Based Suppression

This is a **complete redesign** of the library to address reliability issues with environment-based detection. Many users reported console logs still appearing in production due to inconsistent `NODE_ENV` handling across different bundlers.

### 📋 What Changed (TL;DR)

**Removed:**
- ❌ Environment auto-detection (`NODE_ENV` checks)
- ❌ `suppressAllInDev`, `suppressAllInProd` options
- ❌ Complex singleton state management
- ❌ 7 separate test files

**Added:**
- ✅ URL-based configuration (reliable everywhere)
- ✅ Per-URL rules (different configs per environment)
- ✅ `keepErrors` option (renamed from `preserveErrors`)
- ✅ Single comprehensive test file

**Migration:**
```javascript
// Old (v3.x) ❌
suppressConsole({ suppressAllInProd: true });

// New (v4.0.0) ✅
suppressConsole({ url: 'myapp.com', enable: true });
```

---

### ✨ Added

- **URL-Based Configuration** - Reliable suppression based on domain matching instead of environment variables
- **Per-URL Rules** - Different suppression configs for different environments (production, staging, preprod, etc.)
- **First-Match-Wins Logic** - Predictable rule priority based on array order
- **Subdomain Matching** - Automatically matches subdomains (e.g., `myapp.com` matches `app.myapp.com`)
- **`keepErrors` Option** - Renamed from `preserveErrors` for clarity (keeps console.error visible by default)
- **Explicit Control** - User decides when to suppress, no magic auto-detection
- **Comprehensive Documentation** - "Why This Approach" section explaining design decisions

### 🔄 Changed

- **BREAKING:** Complete API redesign from environment-based to URL-based configuration
- **BREAKING:** `preserveErrors` renamed to `keepErrors` (clearer naming)
- **BREAKING:** Removed `suppressAllInDev` and `suppressAllInProd` options
- **BREAKING:** `ConsoleSuppressionOptions` replaced with `ConsoleConfig`
- **BREAKING:** React components now require explicit config
  - `useConsoleSuppression()` now takes `ConsoleConfig | ConsoleConfig[]` instead of options object
  - `<ConsoleSuppressionProvider>` now requires `config` prop instead of individual option props
  - No more `enabled` prop - use `enable` in each config rule
- Simplified core logic - removed singleton pattern, reduced complexity
- Function signature changes:
  - `suppressConsole(config: ConsoleConfig | ConsoleConfig[])` (was: `suppressConsole(options?: ConsoleSuppressionOptions)`)
- Updated React hook and provider to use new config format
- Streamlined tests to single file (`test.ts`)

### API Comparison

#### Old v3.x React API:
```tsx
// Hook
useConsoleSuppression({
  methods: ['log', 'warn'],
  suppressAllInDev: false,
  suppressAllInProd: true,
  preserveErrors: true,
  enabled: true
});

// Provider
<ConsoleSuppressionProvider
  methods={['log', 'warn']}
  suppressAllInDev={false}
  suppressAllInProd={true}
  preserveErrors={true}
  enabled={true}
>
  <App />
</ConsoleSuppressionProvider>
```

#### New v4.0.0 React API:
```tsx
// Hook - simple and explicit
useConsoleSuppression([
  { url: 'myapp.com', enable: true },
  { url: 'localhost', enable: false }
]);

// Provider - same pattern
<ConsoleSuppressionProvider
  config={[
    { url: 'myapp.com', enable: true },
    { url: 'localhost', enable: false }
  ]}
>
  <App />
</ConsoleSuppressionProvider>
```

### 🗑️ Removed

- **BREAKING:** Environment auto-detection functionality
  - `detectEnvironment()` function
  - `isProduction()` helper
  - `isDevelopment()` helper
  - `Environment` type
- **BREAKING:** `src/utils/environment.ts` file (entire file deleted)
- **BREAKING:** Old configuration options
  - `suppressAllInDev` option
  - `suppressAllInProd` option
  - `ConsoleSuppressionOptions` interface
  - `ConsoleSuppressionState` interface
- **BREAKING:** Singleton state management class
  - `ConsoleSuppressionManager` class
  - Complex state tracking
- **BREAKING:** Exported utility `getMethodsToSuppress()` (now internal)
- Old test suite structure (7 test files replaced with 1)
- `tests/` directory and all subdirectories
  - `tests/unit/` folder
  - `tests/integration/` folder
  - `tests/utils/` folder
  - `run-all-tests.ts`
  - `test-config.ts`

### 📦 What Stays the Same

- ✅ React hook: `useConsoleSuppression()` (with updated API)
- ✅ React provider: `<ConsoleSuppressionProvider>` (with updated props)
- ✅ Core functions: `suppressConsole()`, `restoreConsole()`
- ✅ Status functions: `isConsoleSuppressionActive()`, `getSuppressedMethods()`
- ✅ TypeScript support (full types included)
- ✅ Zero dependencies
- ✅ Small bundle size (~1KB)

### 🐛 Fixed

- **Critical:** Console suppression not working in CRA production builds
- **Critical:** Inconsistent behavior across bundlers (webpack, Vite, Parcel)
- **Critical:** `process.env.NODE_ENV` being undefined in runtime
- Unreliable environment detection in SSR/SSG applications
- Bundler-specific configuration issues

### 📚 Documentation

- Complete README rewrite with new API examples
- Added "Why This Approach?" section explaining v4.0.0 design decisions
- Migration guide from v3.x to v4.0.0
- Framework-specific integration examples (CRA, Vite, Next.js)
- Clear explanation of first-match-wins behavior
- FAQ section addressing common questions

### 🔧 Migration Guide from v3.x

#### Before (v3.x):
```javascript
import { suppressConsole } from 'no-console-production';

// Auto-detect based on NODE_ENV
suppressConsole();

// Or with options
suppressConsole({
  suppressAllInProd: true,
  suppressAllInDev: false,
  preserveErrors: true
});
```

#### After (v4.0.0):
```javascript
import { suppressConsole } from 'no-console-production';

// Explicit URL-based config
suppressConsole({ 
  url: 'myapp.com', 
  enable: true 
});

// Multiple environments
suppressConsole([
  { url: 'myapp.com', enable: true },
  { url: 'staging.myapp.com', enable: true },
  { url: 'localhost', enable: false }
]);

// With options
suppressConsole({
  url: 'myapp.com',
  enable: true,
  methods: ['log', 'debug'],
  keepErrors: true  // Previously preserveErrors
});
```

### 💡 Why the Change?

**User Feedback:**
- "Console logs still appear in production!" - Multiple users
- "Doesn't work with Vite" - Issue #X
- "Different behavior in webpack vs Parcel" - Issue #Y

**Technical Issues:**
- `process.env.NODE_ENV` handled differently by each bundler
- Webpack replaces at build time, Vite uses `import.meta.env`
- Browser runtime may not have `process.env` defined
- SSR/SSG apps have different client/server behavior

**Solution:**
URL-based detection is 100% reliable across all environments and bundlers.

---

## [3.1.2] - 2024-XX-XX

### Fixed
- Minor bug fixes and improvements

## [3.1.0] - 2024-XX-XX

### Added
- TypeScript improvements
- Performance optimizations

## [3.0.0] - 2024-XX-XX

### Added
- React hooks and components
- Environment-based auto-detection
- Singleton state management

---

## Migration Notes

### v3.x → v4.0.0

**Required Changes:**
1. Replace environment-based calls with URL-based config
2. Update `preserveErrors` to `keepErrors`
3. Remove `suppressAllInDev` and `suppressAllInProd` options
4. Specify production domain explicitly

**Benefits:**
- ✅ Works reliably across all bundlers
- ✅ No bundler configuration needed
- ✅ Predictable behavior
- ✅ Easier to debug
- ✅ Better control

**Effort:** Low - Simple find/replace in most cases

---

## Links

- [Homepage](https://github.com/Happybajwa/no-console-production)
- [npm Package](https://www.npmjs.com/package/no-console-production)
- [Issues](https://github.com/Happybajwa/no-console-production/issues)
