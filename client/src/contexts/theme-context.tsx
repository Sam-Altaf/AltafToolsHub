import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get saved theme from localStorage or default to dark
    const saved = localStorage.getItem("theme") as Theme;
    return saved || "dark";
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    // Function to apply theme to document
    const applyTheme = (theme: Theme) => {
      let resolved: ResolvedTheme;
      
      if (theme === "system") {
        // Check system preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        resolved = systemPrefersDark ? "dark" : "light";
      } else {
        resolved = theme as ResolvedTheme;
      }

      // Apply or remove dark class
      const root = document.documentElement;
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      setResolvedTheme(resolved);
    };

    // Apply theme on mount and when theme changes
    applyTheme(theme);

    // Save theme preference to localStorage
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme(theme);
      
      // Add event listener
      mediaQuery.addEventListener("change", handleChange);
      
      // Cleanup
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}