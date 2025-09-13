// colorsapp-theme-toggle-animation 🔽

/**
 * Demo-only theme configuration.
 * Not intended for production or practical usage.
 * Values are simplified and may not meet accessibility or design token requirements.
 */
export const THEME = {
  light: {
    background: "#FFFFFF",
    text: "#140B28",
    bgElement: "#73737340",
    bgLine: "#BBB9BB",
  },
  dark: {
    background: "#231E2B",
    text: "#FFFFFF",
    bgElement: "#73737370",
    bgLine: "#1B1721",
  },
};

export type ThemeType = "light" | "dark";

export interface ThemeToggleButtonProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// colorsapp-theme-toggle-animation 🔼
