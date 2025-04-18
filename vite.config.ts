import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import { fileURLToPath, URL } from 'url';
// Define __dirname for use in ES modules
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
        '@fullcalendar/daygrid/main.css': resolve(__dirname, 'node_modules/@fullcalendar/daygrid/main.css'),
        '@fullcalendar/timegrid/main.css': resolve(__dirname, 'node_modules/@fullcalendar/timegrid/main.css'),
    },
}
})
