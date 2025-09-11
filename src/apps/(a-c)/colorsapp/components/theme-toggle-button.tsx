import React, { FC } from "react";
import { GestureResponderEvent, Pressable } from "react-native";
import switchTheme from "react-native-theme-switch-animation";
import { Moon, Sun } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { THEME, ThemeToggleButtonProps } from "../lib/constants/theme";

export const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ theme, setTheme }) => {
  const toggleTheme = (e: GestureResponderEvent) => {
    e.currentTarget.measure((x1, y1, width, height, px, py) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      switchTheme({
        switchThemeFunction: () => (theme === "dark" ? setTheme("light") : setTheme("dark")),
        animationConfig: {
          type: "circular",
          duration: 500,
          startingPoint: {
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
      className="p-2 rounded-full border"
      style={{ borderColor: THEME[theme].bgElement }}
    >
      {theme === "light" ? (
        <Moon size={20} color={THEME.light.text} />
      ) : (
        <Sun size={20} color={THEME.dark.text} />
      )}
    </Pressable>
  );
};
