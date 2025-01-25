import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GlobalStyles } from "./global-styles.ts"
import { ThemeProvider } from "styled-components"
import { theme } from "antd"

const client = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme.defaultSeed}>
        <App />
      </ThemeProvider>
      <GlobalStyles />
    </QueryClientProvider>
  </StrictMode>
)
