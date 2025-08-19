const { suppressConsole } = require('./dist/index.js');

console.log('🧪 Testing Error Logic Fixes...\n');

// Mock environment for testing
process.env.NODE_ENV = 'production';

// Store original console methods
const originalError = console.error;
const originalLog = console.log;
const originalWarn = console.warn;

let errorCalls = [];
let logCalls = [];
let warnCalls = [];

// Mock console methods to track calls
console.error = (...args) => errorCalls.push(args);
console.log = (...args) => logCalls.push(args);
console.warn = (...args) => warnCalls.push(args);

function runTest(testName, config, expectedErrors, expectedLogs, expectedWarns) {
  console = { ...console, error: console.error, log: console.log, warn: console.warn };
  errorCalls = [];
  logCalls = [];
  warnCalls = [];
  
  const cleanup = suppressConsole(config);
  
  console.error('test error');
  console.log('test log');
  console.warn('test warn');
  
  cleanup();
  
  const errorVisible = errorCalls.length > 0;
  const logVisible = logCalls.length > 0;
  const warnVisible = warnCalls.length > 0;
  
  const passed = errorVisible === expectedErrors && 
                 logVisible === expectedLogs && 
                 warnVisible === expectedWarns;
  
  originalLog(`${passed ? '✅' : '❌'} ${testName}`);
  originalLog(`   Errors: ${errorVisible ? 'visible' : 'hidden'} (expected: ${expectedErrors ? 'visible' : 'hidden'})`);
  originalLog(`   Logs: ${logVisible ? 'visible' : 'hidden'} (expected: ${expectedLogs ? 'visible' : 'hidden'})`);
  originalLog(`   Warns: ${warnVisible ? 'visible' : 'hidden'} (expected: ${expectedWarns ? 'visible' : 'hidden'})`);
  originalLog('');
  
  return passed;
}

// Test scenarios
let allPassed = true;

// Test 1: Default behavior (preserveErrors: true)
allPassed &= runTest(
  'Default behavior',
  {},
  true,  // errors visible
  false, // logs hidden  
  false  // warns hidden
);

// Test 2: preserveErrors: false
allPassed &= runTest(
  'preserveErrors: false',
  { preserveErrors: false },
  false, // errors hidden
  false, // logs hidden
  false  // warns hidden
);

// Test 3: Custom methods with error explicitly included (should hide error)
allPassed &= runTest(
  'Custom methods: ["log", "error"] (error explicitly requested)',
  { methods: ['log', 'error'] },
  false, // errors hidden (explicitly requested)
  false, // logs hidden
  true   // warns visible (not in methods)
);

// Test 4: Custom methods with error explicitly included + preserveErrors: true (should still hide error)
allPassed &= runTest(
  'Custom methods: ["log", "error"] + preserveErrors: true (explicit wins)',
  { methods: ['log', 'error'], preserveErrors: true },
  false, // errors hidden (explicit methods override preserveErrors)
  false, // logs hidden
  true   // warns visible
);

// Test 5: Custom methods without error + preserveErrors: true
allPassed &= runTest(
  'Custom methods: ["log", "warn"] + preserveErrors: true',
  { methods: ['log', 'warn'], preserveErrors: true },
  true,  // errors visible (not in methods)
  false, // logs hidden
  false  // warns hidden
);

// Test 6: Custom methods without error + preserveErrors: false  
allPassed &= runTest(
  'Custom methods: ["log", "warn"] + preserveErrors: false',
  { methods: ['log', 'warn'], preserveErrors: false },
  true,  // errors visible (not in methods, preserveErrors irrelevant for explicit methods)
  false, // logs hidden
  false  // warns hidden
);

// Restore original console
console.error = originalError;
console.log = originalLog;
console.warn = originalWarn;

console.log(allPassed ? '🎉 All tests passed!' : '💥 Some tests failed!');
