import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // ✅ always use 5173
    strictPort: true  // ✅ error if 5173 is taken (won't switch to 5174)
  }
})