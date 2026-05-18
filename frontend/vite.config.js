import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Local dev: /upload → localhost:5000/upload (no /api prefix needed now)
      '/upload': { target: 'http://localhost:5000', changeOrigin: true },
      '/analyze': { target: 'http://localhost:5000', changeOrigin: true },
      '/submit-profile': { target: 'http://localhost:5000', changeOrigin: true },
      '/recommendations': { target: 'http://localhost:5000', changeOrigin: true },
      '/charts': { target: 'http://localhost:5000', changeOrigin: true },
      '/predict': { target: 'http://localhost:5000', changeOrigin: true },
      '/generate-pdf': { target: 'http://localhost:5000', changeOrigin: true },
      '/questions': { target: 'http://localhost:5000', changeOrigin: true },
      '/history': { target: 'http://localhost:5000', changeOrigin: true },
    }
  }
})
