import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // axe-core (the live accessibility audit) is a large chunk on purpose:
    // it is only downloaded when a visitor clicks "Audit this page".
    chunkSizeWarningLimit: 800,
  },
})
