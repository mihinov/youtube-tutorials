import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const projectName = process.env.PROJECT || 'default';
  const rootDir = path.resolve(__dirname, projectName);

  return {
    root: rootDir,
    build: {
      outDir: path.resolve(__dirname, 'dist', projectName),
    },
  };
});
