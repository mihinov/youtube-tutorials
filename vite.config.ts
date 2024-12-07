import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const projectName = process.env.PROJECT || 'default';
  const rootDir = path.resolve(__dirname, projectName);

  return {
    root: rootDir,
    build: {
      outDir: path.resolve(__dirname, 'dist', projectName),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: '[name].[hash][extname]', // Пример настройки имен файлов
          entryFileNames: '[name].[hash].js',
        },
      },
    },
    base: `./`, // Делает пути в сгенерированных файлах относительными
  };
});
