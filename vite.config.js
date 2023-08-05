import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        'youtube-css-paint-api': resolve(__dirname, './youtube-css-paint-api/src/index.html'),
      },
			output: [
				{
					name: 'youtube-css-paint-api',
					dir: 'dist'
				}
			]
    },
  },
  server: {
    open: './youtube-css-paint-api/src/index.html',
  }
})
