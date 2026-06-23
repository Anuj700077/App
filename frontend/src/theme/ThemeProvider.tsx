import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, Theme } from "./tokens";

type Mode = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  mode: Mode;
  isDark: boolean;
  toggle: () => void;
  setMode: (m: Mode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>(system === "dark" ? "dark" : "light");

  const toggle = useCallback(() => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === "dark";
    return {
      mode,
      isDark,
      theme: isDark ? darkColors : lightColors,
      toggle,
      setMode,
    };
  }, [mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
