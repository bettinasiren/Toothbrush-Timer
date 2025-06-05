import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      '/login': 'http://localhost:3002',
      '/logout': 'http://localhost:3002',
      '/user': 'http://localhost:3002',
      '/avatars': 'http://localhost:3002',
      '/token': 'http://localhost:3002',
      '/brushing': 'http://localhost:3002',
      '/brushing-sessions': 'http://localhost:3002',
      }
  }
})
