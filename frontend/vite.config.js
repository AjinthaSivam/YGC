import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Specify the build output directory
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
  }
})
