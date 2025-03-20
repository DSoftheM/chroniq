import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GlobalStyles } from "./global-styles.ts"
import { ThemeProvider } from "styled-components"
import { ConfigProvider, theme } from "antd"
import { NotificationProvider } from "./global/notification-provider.tsx"

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const x = 1

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme.defaultSeed}>
        <NotificationProvider>
          <ConfigProvider form={{ validateMessages: { required: "Обязательное поле" } }}>
            <App />
          </ConfigProvider>
        </NotificationProvider>
      </ThemeProvider>
      <GlobalStyles />
    </QueryClientProvider>
  </StrictMode>
)
