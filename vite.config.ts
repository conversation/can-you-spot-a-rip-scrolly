import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [react(), mdx({})],
  define: { global: {} },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mdx-js/loader', '@mdx-js/react', '@mdx-js/rollup', '@react-hook/size']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
