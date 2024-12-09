import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL, // Default to localhost if env is not set
        changeOrigin: true,
      },
    },
  },
});
