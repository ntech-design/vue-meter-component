import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    base: './',
    plugins: [ vue() ],
    resolve: {
      tsconfigPaths: true,
      extensions: ['.js', '.ts', '.json', '.vue']
    },
    server: {
      open: true,
      host: 'localhost',
      port: 5174,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      manifest: false,
      sourcemap: isProduction ? 'hidden' : 'inline',
      minify: isProduction,
      assetsInlineLimit: 0,
      cssCodeSplit: true,
      rolldownOptions: {
        input: {
          main: path.resolve(__dirname, 'src/main.ts'),
        },
        output: {
          entryFileNames: isProduction ? '[name].[hash].js' : '[name].js',
          chunkFileNames: isProduction ? '[name].[hash].chunk.js' : '[name].chunk.js',
          assetFileNames: isProduction ? '[name].[hash][extname]' : '[name][extname]',
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.{test,spec}.{ts,js}'],
    },
  };
});