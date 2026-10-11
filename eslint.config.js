import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
    js.configs.recommended,

    ...tseslint.configs.strictTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },

            globals: {
                ...globals.node,
            },
        },

        rules: {
            // Disallow explicit any
            '@typescript-eslint/no-explicit-any': 'error',

            // Require type imports
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                },
            ],

            // Ignore variables prefixed with _
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            // Catch forgotten promises
            '@typescript-eslint/no-floating-promises': 'error',

            // Prevent promises in places expecting booleans/functions
            '@typescript-eslint/no-misused-promises': 'error',

            // Prevent unnecessary async functions
            '@typescript-eslint/require-await': 'error',

            // Prefer ?? over ||
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
        },
    },

    {
        files: [
            '**/*.test.ts',
            '**/*.spec.ts',
        ],

        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    {
        ignores: [
            'dist/**',
            'coverage/**',
            'eslint.config.js',
            'tsup.config.ts',
            'vitest.config.ts',
            'ecosystem.config.cjs'
        ],
    }
);