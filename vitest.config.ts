import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Makes Vitest APIs (describe, it, expect, beforeEach, etc.)
        // available globally without importing them in every test file.
        globals: true,

        // Runs tests in a Node.js environment.
        // Suitable for backend/server-side code.
        environment: "node",

        // Pattern used to discover test files.
        // Matches files like test/example.test.ts.
        include: ["__tests__/**/*.test.ts"],

        // Clears mock call history and mock state before each test.
        clearMocks: true,

        // Restores original implementations for all mocked functions
        // after each test, preventing mock leakage between tests.
        restoreMocks: true,

        coverage: {
            // Uses Node.js V8 engine for code coverage collection.
            provider: "v8",

            // Generates coverage reports in multiple formats:
            // - text: console output
            // - json: machine-readable report
            // - lcov: CI/CD and coverage services
            // - html: interactive browser report
            reporter: ["text", "json", "lcov", "html"],

            // Files and directories excluded from coverage calculations.
            exclude: [
                "dist/**",         // Compiled/build output
                "node_modules/**", // Third-party dependencies
                "test/**",         // Test source files
            ],
        },
    },
});