import { createContext, useContext, useState } from "react"

// Light Theme
const lightTheme = {
  background: "#F5F5F5", // Light gray background
  text: "#333333", // Dark gray text
  primary: "#4A90E2", // Calm professional blue
  secondary: "#50C878", // Soft mint green
  accent: "#F5A623", // Vibrant orange for CTA
}

// Dark Theme
const darkTheme = {
  background: "#121212", // Dark gray (almost black) background
  text: "#E0E0E0", // Light gray text
  primary: "#4A90E2", // Calm professional blue (adapted for dark theme)
  secondary: "#50C878", // Soft mint green for accents
  accent: "#F5A623", // Vibrant orange for CTA
}

const ThemeContext = createContext({
  theme: lightTheme,
  setTheme: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light")

  return (
    <ThemeContext.Provider value={{ theme: theme === "dark" ? darkTheme : lightTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
