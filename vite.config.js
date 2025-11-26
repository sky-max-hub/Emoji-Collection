import { defineConfig } from 'vite'
import copyRootJson from './plugins/copyRootJson.js'
import convertReadme from './plugins/convertReadme.js'

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    copyPublicDir: true
  },
  plugins: [
    copyRootJson(),
    convertReadme()
  ]
})
