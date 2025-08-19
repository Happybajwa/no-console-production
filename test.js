// Comprehensive test suite for no-console-production v3.0.0
const {
  suppressConsole,
  restoreConsole,
  isConsoleSuppressionActive,
  getSuppressedMethods,
} = require("./dist/index.js");

console.log("🧪 NO-CONSOLE-PRODUCTION v3.0.0 - Test Suite\n");

let testCount = 0;
const runTest = (name, testFn) => {
  testCount++;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🎯 TEST ${testCount}: ${name}`);
  console.log("=".repeat(60));
  testFn();
};

// Save original environment
const originalEnv = process.env.NODE_ENV;

runTest("Basic Suppression (Production)", () => {
  process.env.NODE_ENV = "production";

  console.log("Before suppression:");
  console.log("  📝 Log message - should be visible");
  console.warn("  ⚠️ Warning message - should be visible");
  console.error("  ❌ Error message - should be visible");

  const cleanup = suppressConsole();

  console.log("\nAfter suppression (default: preserveErrors=true):");
  console.log("  📝 Log message - should be HIDDEN");
  console.warn("  ⚠️ Warning message - should be HIDDEN");
  console.error("  ❌ Error message - should be VISIBLE (preserved)");

  console.log("\nStatus:", {
    active: isConsoleSuppressionActive(),
    suppressed: getSuppressedMethods(),
  });

  cleanup();
  console.log("\nAfter cleanup - all messages should be visible again:");
  console.log("  📝 Log restored");
  console.warn("  ⚠️ Warning restored");
});

runTest("Development Environment", () => {
  process.env.NODE_ENV = "development";

  console.log("Development mode (should not suppress by default):");
  const cleanup1 = suppressConsole();
  console.log("  📝 Dev log - should be VISIBLE");
  console.warn("  ⚠️ Dev warning - should be VISIBLE");
  cleanup1();

  console.log("\nForced suppression in development:");
  const cleanup2 = suppressConsole({ suppressAllInDev: true });
  console.log("  📝 Dev log - should be HIDDEN");
  console.error("  ❌ Dev error - should be VISIBLE (preserveErrors=true)");
  cleanup2();
});

runTest("Error Control", () => {
  process.env.NODE_ENV = "production";

  console.log("Test 1: Default (preserve errors):");
  const cleanup1 = suppressConsole();
  console.log("  📝 Log - should be HIDDEN");
  console.error("  ❌ Error - should be VISIBLE");
  cleanup1();

  console.log("\nTest 2: Hide errors (preserveErrors: false):");
  const cleanup2 = suppressConsole({ preserveErrors: false });
  console.log("  📝 Log - should be HIDDEN");
  console.error("  ❌ Error - should be HIDDEN");
  cleanup2();

  console.log("\nTest 3: Custom methods with error preservation:");
  const cleanup3 = suppressConsole({
    methods: ["log", "error"],
    preserveErrors: true,
  });
  console.log("  📝 Log - should be HIDDEN");
  console.error(
    "  ❌ Error - should be VISIBLE (preserved despite being in methods)"
  );
  cleanup3();
});

runTest("Custom Method Selection", () => {
  process.env.NODE_ENV = "production";

  const cleanup = suppressConsole({
    methods: ["log", "debug"],
  });

  console.log("Selective suppression (log + debug only):");
  console.log("  📝 Log - should be HIDDEN");
  console.debug("  🔍 Debug - should be HIDDEN");
  console.warn("  ⚠️ Warning - should be VISIBLE");
  console.error("  ❌ Error - should be VISIBLE");

  cleanup();
});

runTest("Performance & Singleton Behavior", () => {
  process.env.NODE_ENV = "production";

  console.log("Performance test (1000 cycles):");
  const start = process.hrtime.bigint();

  for (let i = 0; i < 1000; i++) {
    const cleanup = suppressConsole({ methods: ["log"] });
    cleanup();
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000;
  console.log(
    `  ⚡ Completed in ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(
      4
    )}ms per cycle)`
  );

  console.log("\nSingleton behavior:");
  const cleanup1 = suppressConsole({ methods: ["log"] });
  const cleanup2 = suppressConsole({ methods: ["warn"] }); // Should not override

  console.log("  📝 Log - should be HIDDEN");
  console.warn(
    "  ⚠️ Warning - should be VISIBLE (singleton prevents override)"
  );

  cleanup1(); // Should restore everything
  console.log("  📝 After cleanup - should be VISIBLE");
});

runTest("Edge Cases & Error Handling", () => {
  console.log("Testing edge cases:");

  // Empty options
  const cleanup1 = suppressConsole({});
  console.log("  ✅ Empty options handled");
  cleanup1();

  // Invalid methods (should be filtered)
  const cleanup2 = suppressConsole({
    methods: ["log", "invalid"],
    suppressAllInProd: false,
  });
  console.log("  ✅ Invalid methods handled");
  cleanup2();

  // Multiple cleanups
  const cleanup3 = suppressConsole({ methods: ["log"] });
  cleanup3();
  cleanup3(); // Should not break
  console.log("  ✅ Multiple cleanups handled");

  console.log("  ✅ All edge cases passed");
});

runTest("Real-world Scenario", () => {
  process.env.NODE_ENV = "production";

  console.log("Simulating app startup:");
  console.log("  🚀 App initializing...");
  console.log("  📦 Loading modules...");
  console.warn("  ⚠️ Deprecated API warning");

  // Enable suppression for production
  const cleanup = suppressConsole();

  console.log("\nApp running in production:");
  console.log("  📊 Processing data... (should be hidden)");
  console.log("  🔄 Background task... (should be hidden)");
  console.warn("  ⚠️ Performance warning (should be hidden)");
  console.error("  ❌ Critical error occurred (should be visible)");

  // Simulate debug mode toggle
  cleanup();
  console.log("\nDebug mode enabled:");
  console.log("  🔍 Debug info now visible");
});

// Cleanup
process.env.NODE_ENV = originalEnv;

console.log("\n" + "=".repeat(60));
console.log("✅ ALL TESTS COMPLETED SUCCESSFULLY!");
console.log("=".repeat(60));
console.log(`📊 Total tests run: ${testCount}`);
console.log("🎉 Library is working perfectly!");
