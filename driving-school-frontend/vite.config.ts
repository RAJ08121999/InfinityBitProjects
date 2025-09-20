import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target:'react',
      autoCodeSplitting:true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve:{
    alias: {
      "@":path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,   // changing from 5173 to 5174 because 5173 is denying access
    host: true,   // allows access on localhost and network
  },
})
