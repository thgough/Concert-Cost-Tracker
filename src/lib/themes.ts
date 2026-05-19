/** Curated daisyUI themes — primary: buttons/tabs, secondary: fun badges, accent: charts */
export const DAISY_THEMES = [
  "light",
  "dark",
  "synthwave",
  "forest",
  "corporate",
  "cupcake",
  "dracula",
  "sunset",
] as const;

export type DaisyTheme = (typeof DAISY_THEMES)[number];

export const THEME_STORAGE_KEY = "concert-theme";

export function applyTheme(theme: string) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function getStoredTheme(): string {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && DAISY_THEMES.includes(stored as DaisyTheme)) {
    return stored;
  }
  return "light";
}
