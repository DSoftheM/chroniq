import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@api": "/src/api",
      "@components": "/src/components",
      "@features": "/src/features",
      "@lib": "/src/lib",
    },
  },
})
