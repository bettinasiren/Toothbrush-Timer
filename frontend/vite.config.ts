import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/avatars': 'http://localhost:3000',
      '/token': 'http://localhost:3000',
      '/brushing': 'http://localhost:3000',
      '/brushing-sessions': 'http://localhost:3000',
      }
  }
})
