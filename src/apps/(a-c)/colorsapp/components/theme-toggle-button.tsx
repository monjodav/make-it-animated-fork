// colorsapp-theme-toggle-animation 🔽

/**
 * Motion intent: trigger a circular reveal from the user's touch point that switches app theme.
 * Why: originating the mask at the press center creates a direct cause→effect link and feels tactile.
 * Timing: 500ms balances snappiness with perceptibility of the radial expansion.
 * Platform: uses native haptics for lightweight confirmation; the animation is handled by the library on the UI thread.
 */

import React, { FC } from "react";
import { GestureResponderEvent, Pressable } from "react-native";
import switchTheme from "react-native-theme-switch-animation";
import { Moon, Sun } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { THEME, ThemeToggleButtonProps } from "../lib/constants/theme";

export const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ theme, setTheme }) => {
  /**
   * Why measure? We need the absolute center of the pressed element to seed the radial mask.
   * The library expands a circle from (cx, cy) outward; starting at the touch point preserves spatial continuity.
   */
  const toggleTheme = (e: GestureResponderEvent) => {
    e.currentTarget.measure((x1, y1, width, height, px, py) => {
      // Tactile confirmation timed with animation start; Light impact is subtle enough for frequent toggles.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      switchTheme({
        // Delegate the actual theme flip to the caller; animation library coordinates visual transition.
        switchThemeFunction: () => (theme === "dark" ? setTheme("light") : setTheme("dark")),
        animationConfig: {
          // Circular mask mimics iOS-style material transitions; avoids directional bias of linear wipes.
          type: "circular",
          // Magic number: 500ms chosen for readability of radial growth without feeling sluggish.
          // Shorter (<350ms) reads as a flash; longer (>650ms) feels heavy for a frequent action.
          duration: 500,
          startingPoint: {
            // Center of the pressed element in page coordinates.
            // Note: measure() returns pageX/pageY (px/py) which are stable across scroll/transform contexts.
            // Android/iOS both report in screen space; safe for seeding a global reveal.
            cy: py + height / 2,
            cx: px + width / 2,
          },
        },
      });
    });
  };

  return (
    <Pressable
      onPress={toggleTheme}
      // Rounded container visually matches the circular reveal; border provides contrast cue pre/post switch.
      className="p-2 rounded-full border"
      // Using THEME token keeps the affordance legible during the transition; colors are demo-only (see theme.ts note).
      style={{ borderColor: THEME[theme].bgElement }}
    >
      {/**
       * Icon represents the destination theme (action affordance), not the current state.
       * Why: showing Moon while in light mode communicates "tap to go dark" more clearly.
       */}
      {theme === "light" ? (
        <Moon size={20} color={THEME.light.text} />
      ) : (
        <Sun size={20} color={THEME.dark.text} />
      )}
    </Pressable>
  );
};

// colorsapp-theme-toggle-animation 🔼
