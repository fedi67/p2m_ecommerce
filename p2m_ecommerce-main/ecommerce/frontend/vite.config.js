import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This exposes the server to the Docker network
    allowedHosts: [
      'host.docker.internal', // This tells Vite to trust Jenkins!
      'localhost'
    ]
  }
})
