/**
 * @fileoverview Test configuration and environment setup
 */

/**
 * Test environments to validate
 */
export const TEST_ENVIRONMENTS = {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
    TEST: "test",
    STAGING: "staging",
    UNDEFINED: undefined,
} as const;

/**
 * Console methods to test
 */
export const CONSOLE_METHODS = [
    "log",
    "warn",
    "error",
    "debug",
    "info"
] as const;

/**
 * Test scenarios for comprehensive coverage
 */
export const TEST_SCENARIOS = {
    // Environment-based scenarios
    DEV_DEFAULT: {
        env: "development",
        options: {},
        expectedSuppressed: [],
        description: "Development with default options"
    },

    PROD_DEFAULT: {
        env: "production",
        options: {},
        expectedSuppressed: ["log", "warn", "debug", "info"],
        description: "Production with default options"
    },

    DEV_SUPPRESS_ALL: {
        env: "development",
        options: { suppressAllInDev: true },
        expectedSuppressed: ["log", "warn", "debug", "info"],
        description: "Development with suppressAllInDev enabled"
    },

    PROD_NO_SUPPRESS: {
        env: "production",
        options: { suppressAllInProd: false },
        expectedSuppressed: [],
        description: "Production with suppressAllInProd disabled"
    },

    // preserveErrors scenarios
    PROD_NO_PRESERVE_ERRORS: {
        env: "production",
        options: { preserveErrors: false },
        expectedSuppressed: ["log", "warn", "error", "debug", "info"],
        description: "Production with preserveErrors disabled"
    },

    // Explicit methods scenarios
    EXPLICIT_LOG_WARN: {
        env: "development",
        options: { methods: ["log", "warn"] },
        expectedSuppressed: ["log", "warn"],
        description: "Explicit suppression of log and warn"
    },

    EXPLICIT_ALL: {
        env: "development",
        options: { methods: ["log", "warn", "error", "debug", "info"] },
        expectedSuppressed: ["log", "warn", "error", "debug", "info"],
        description: "Explicit suppression of all methods"
    },

    // Browser environment
    BROWSER_LIKE: {
        env: null, // No process object
        options: {},
        expectedSuppressed: ["log", "warn", "debug", "info"],
        description: "Browser-like environment (no NODE_ENV)"
    },

    // Edge cases
    EMPTY_OPTIONS: {
        env: "production",
        options: {},
        expectedSuppressed: ["log", "warn", "debug", "info"],
        description: "Empty options object"
    },

    NULL_OPTIONS: {
        env: "production",
        options: null,
        expectedSuppressed: ["log", "warn", "debug", "info"],
        description: "Null options"
    }
} as const;

/**
 * Performance test configurations
 */
export const PERFORMANCE_TESTS = {
    ITERATIONS: 1000,
    CONSOLE_CALLS_PER_ITERATION: 10,
    MAX_ACCEPTABLE_OVERHEAD_MS: 5,
} as const;

/**
 * Memory test configurations  
 */
export const MEMORY_TESTS = {
    SUPPRESS_RESTORE_CYCLES: 100,
    MAX_MEMORY_LEAK_MB: 1,
} as const;
