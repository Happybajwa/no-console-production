/**
 * @fileoverview Comprehensive tests for no-console-production v4.0.0
 * @version 4.0.0
 */

import {
    suppressConsole,
    restoreConsole,
    isConsoleSuppressionActive,
    getSuppressedMethods,
} from "./src/index";

// Simple test framework
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void | Promise<void>) {
    try {
        const result = fn();
        if (result instanceof Promise) {
            result
                .then(() => {
                    results.push({ name, passed: true });
                    console.log(`✅ ${name}`);
                })
                .catch((error) => {
                    results.push({ name, passed: false, error: error.message });
                    console.log(`❌ ${name}: ${error.message}`);
                });
        } else {
            results.push({ name, passed: true });
            console.log(`✅ ${name}`);
        }
    } catch (error: any) {
        results.push({ name, passed: false, error: error.message });
        console.log(`❌ ${name}: ${error.message}`);
    }
}

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

// Mock window.location for testing
(global as any).window = {
    location: {
        hostname: "localhost",
    },
};

console.log("🚀 Running no-console-production v4.0.0 tests\n");
console.log("=".repeat(60));

// Store original console methods
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

// ============================================================================
// Core Functionality Tests
// ============================================================================

test("Should not suppress on non-matching URL", () => {
    (global as any).window.location.hostname = "localhost";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(!isConsoleSuppressionActive(), "Should not be active on localhost");

    restoreConsole();
});

test("Should suppress on matching URL", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(isConsoleSuppressionActive(), "Should be active on myapp.com");
    assert(console.log !== originalLog, "console.log should be suppressed");

    restoreConsole();
});

test("Should match subdomains", () => {
    (global as any).window.location.hostname = "app.myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(isConsoleSuppressionActive(), "Should match subdomain");

    restoreConsole();
});

test("Should respect enable: false", () => {
    (global as any).window.location.hostname = "localhost";

    suppressConsole({ url: "localhost", enable: false });

    assert(!isConsoleSuppressionActive(), "Should not suppress when enable: false");

    restoreConsole();
});

// ============================================================================
// Multiple Rules Tests
// ============================================================================

test("First matching rule wins", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole([
        { url: "myapp.com", enable: true },
        { url: "myapp.com", enable: false }, // Duplicate - should be ignored
    ]);

    assert(isConsoleSuppressionActive(), "First rule should win");

    restoreConsole();
});

test("Specific URL before general URL", () => {
    (global as any).window.location.hostname = "dev.myapp.com";

    suppressConsole([
        { url: "dev.myapp.com", enable: false }, // Specific first
        { url: "myapp.com", enable: true },      // General second
    ]);

    assert(!isConsoleSuppressionActive(), "Specific rule should match first");

    restoreConsole();
});

// ============================================================================
// Method Suppression Tests
// ============================================================================

test("Should suppress all methods by default (keepErrors: true)", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    const suppressed = getSuppressedMethods();

    assert(suppressed.includes("log"), "Should suppress log");
    assert(suppressed.includes("warn"), "Should suppress warn");
    assert(suppressed.includes("debug"), "Should suppress debug");
    assert(suppressed.includes("info"), "Should suppress info");
    assert(!suppressed.includes("error"), "Should NOT suppress error by default");

    restoreConsole();
});

test("Should suppress specific methods only", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({
        url: "myapp.com",
        enable: true,
        methods: ["log", "debug"],
    });

    const suppressed = getSuppressedMethods();

    assert(suppressed.includes("log"), "Should suppress log");
    assert(suppressed.includes("debug"), "Should suppress debug");
    assert(suppressed.length === 2, "Should only suppress 2 methods");

    restoreConsole();
});

test("Should suppress errors when keepErrors: false", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({
        url: "myapp.com",
        enable: true,
        keepErrors: false,
    });

    const suppressed = getSuppressedMethods();

    assert(suppressed.includes("error"), "Should suppress error when keepErrors: false");

    restoreConsole();
});

test("keepErrors: true should filter out error from methods array", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({
        url: "myapp.com",
        enable: true,
        methods: ["log", "warn", "error"],
        keepErrors: true,
    });

    const suppressed = getSuppressedMethods();

    assert(suppressed.includes("log"), "Should suppress log");
    assert(suppressed.includes("warn"), "Should suppress warn");
    assert(!suppressed.includes("error"), "Should NOT suppress error (filtered out)");

    restoreConsole();
});

// ============================================================================
// Restore Functionality Tests
// ============================================================================

test("Should restore console methods", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(console.log !== originalLog, "console.log should be suppressed");

    restoreConsole();

    assert(console.log === originalLog, "console.log should be restored");
    assert(!isConsoleSuppressionActive(), "Should not be active after restore");
});

test("Restore function returned from suppressConsole works", () => {
    (global as any).window.location.hostname = "myapp.com";

    const restore = suppressConsole({ url: "myapp.com", enable: true });

    assert(isConsoleSuppressionActive(), "Should be active");

    restore();

    assert(!isConsoleSuppressionActive(), "Should not be active after restore");
});

// ============================================================================
// Edge Cases
// ============================================================================

test("Should handle empty methods array", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({
        url: "myapp.com",
        enable: true,
        methods: [],
    });

    const suppressed = getSuppressedMethods();

    assert(suppressed.length === 0, "Should suppress nothing with empty methods array");

    restoreConsole();
});

test("Should not suppress multiple times", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });
    const firstCall = isConsoleSuppressionActive();

    suppressConsole({ url: "myapp.com", enable: true });
    const secondCall = isConsoleSuppressionActive();

    assert(firstCall === secondCall, "Should not change state on second call");

    restoreConsole();
});

test("Should handle URL normalization (www, protocol, trailing slash)", () => {
    (global as any).window.location.hostname = "www.myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(isConsoleSuppressionActive(), "Should match www.myapp.com to myapp.com");

    restoreConsole();
});

test("Should not match partial hostnames", () => {
    (global as any).window.location.hostname = "notmyapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(!isConsoleSuppressionActive(), "Should not match partial hostname");

    restoreConsole();
});

// ============================================================================
// Array Config Tests
// ============================================================================

test("Should accept single config object", () => {
    (global as any).window.location.hostname = "myapp.com";

    suppressConsole({ url: "myapp.com", enable: true });

    assert(isConsoleSuppressionActive(), "Should work with single config");

    restoreConsole();
});

test("Should accept array of configs", () => {
    (global as any).window.location.hostname = "staging.myapp.com";

    suppressConsole([
        { url: "myapp.com", enable: true },
        { url: "staging.myapp.com", enable: true },
        { url: "localhost", enable: false },
    ]);

    assert(isConsoleSuppressionActive(), "Should work with array of configs");

    restoreConsole();
});

// ============================================================================
// Print Results
// ============================================================================

setTimeout(() => {
    console.log("\n" + "=".repeat(60));
    console.log("\n📊 Test Results:\n");

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${results.length}`);

    if (failed > 0) {
        console.log("\n❌ Failed tests:");
        results
            .filter((r) => !r.passed)
            .forEach((r) => {
                console.log(`  - ${r.name}: ${r.error}`);
            });
        process.exit(1);
    } else {
        console.log("\n🎉 All tests passed!");
        process.exit(0);
    }
}, 100);
