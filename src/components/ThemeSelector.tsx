"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  DAISY_THEMES,
  getStoredTheme,
  THEME_STORAGE_KEY,
} from "@/lib/themes";

export default function ThemeSelector({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  function handleChange(next: string) {
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  return (
    <div className={`form-control w-full max-w-xs ${className}`}>
      <label className="label py-0" htmlFor="theme-select">
        <span className="label-text text-xs opacity-70">Theme</span>
      </label>
      <select
        id="theme-select"
        className="select select-bordered select-sm w-full"
        value={mounted ? theme : "light"}
        onChange={(e) => handleChange(e.target.value)}
        disabled={!mounted}
      >
        {DAISY_THEMES.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
