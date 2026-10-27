import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type UseThemeResult = {
  theme: Theme;
  toggleTheme: () => void;
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem("combui-theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return "light";
}

function subscribeNoop(): () => void {
  return () => {};
}

export function useTheme(): UseThemeResult {
  // False only while React hydrates the server HTML. The server cannot read
  // localStorage, so the hydration render must report the server theme.
  // The next render reports the stored theme and fixes the toggle label.
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("combui-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme: isHydrated ? theme : "light", toggleTheme };
}
