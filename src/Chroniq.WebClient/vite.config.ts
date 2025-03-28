import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"

declare global {
  const process: any
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
        "@shared": "/src/shared",
        "@app": "/src/app",
        "@features": "/src/features",
        "@assets": "/src/assets",
      },
    },
    // build: { outDir: "../Chroniq/wwwroot" },
    server: {
      port: +env.VITE_CLIENT_PORT,
      proxy: {
        "/api": {
          target: `http://localhost:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
