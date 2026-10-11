import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src',],
    outDir: 'dist',
    format: ['esm'],
    clean: true,
    dts: false,
    sourcemap: false,
    minify: true,
    target: 'esnext',
    platform: 'node',
    splitting: false,

    bundle: false,           // Disables bundling/inlining
    noExternal: [],          // Bundle nothing from node_modules?
    external: [],            // Actually, we want node_modules as external

    // external: ['express', 'pg', 'mysql2', 'winston', 'cors', 'chalk'],
    loader: {
        '.jpg': 'copy',
        '.svg': 'copy',
        '.txt': 'copy',
        '.png': 'copy',
        '.json': 'copy',
    },
    esbuildOptions(options) {
        options.minifyWhitespace = true;
        options.minifySyntax = true;

        // This disables renaming of variables/imports — keeps original names!
        options.minifyIdentifiers = false;

        // Bonus: preserves function/class names even better (useful for debugging/stack traces)
        options.keepNames = true;

        // Disable hashing for assets -- dir preserves folders
        options.assetNames = '[dir]/[name]';

        // Optional: also control chunks if needed
        // options.chunkNames = '[name]';

        return options;
    },
});
