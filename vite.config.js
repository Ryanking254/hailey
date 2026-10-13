import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  assetsInclude: ['**/*.mp4'],
  server: {
    port: 5173,
    open: true
  }
})
