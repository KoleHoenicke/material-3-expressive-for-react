import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'gallery',
  base: '/material-react-components/',
  plugins: [react()],
  build: {
    outDir: '../dist-gallery',
    emptyOutDir: true,
  },
})
