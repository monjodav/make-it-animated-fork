import React, { FC } from "react";

import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Home } from "lucide-react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { ThemeToggleButton } from "./theme-toggle-button";
import { THEME, ThemeToggleButtonProps } from "../lib/constants/theme";

// colorsapp-home-header-animation 🔽

// Magic numbers define the visual envelope of the collapsible header.
// Max=210 and Min=50 are tuned for this design to reveal enough content while keeping a clear affordance.
// Exposed Scroll_Distance is reused by other components to stay mathematically in sync with the header.
const Base_Header_Max_Height = 210;
const Base_Header_Min_Height = 50;
export const Scroll_Distance = Base_Header_Max_Height - Base_Header_Min_Height;

type Props = {
  scrollOffsetY: SharedValue<number>;
  theme: ThemeToggleButtonProps["theme"];
  setTheme: ThemeToggleButtonProps["setTheme"];
};

export const HomeHeader: FC<Props> = ({ scrollOffsetY, theme, setTheme }) => {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top;
  const paddingBottom = 12;

  // Safe-area adjusted heights ensure the animation math accounts for device top inset.
  // Keeping a dedicated paddingBottom stabilizes the final resting height across devices.
  const Header_Max_Height = Base_Header_Max_Height + paddingTop + paddingBottom;
  const Header_Min_Height = Base_Header_Min_Height + paddingTop + paddingBottom;
  const Scroll_Distance = Header_Max_Height - Header_Min_Height;

  // Container height and background color are both driven by the same scroll source.
  // Range: [0, Scroll_Distance*2] intentionally overshoots (2x) to make the collapse feel gradual,
  // then CLAMP prevents over-animating beyond the min height.
  const animatedHeaderContainer = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffsetY.get(),
      [0, Scroll_Distance * 2],
      [Header_Max_Height, Header_Min_Height],
      Extrapolation.CLAMP
    ),
    // Subtle color shift reinforces depth as the header collapses.
    // Interpolates between two close hues to avoid distracting flicker.
    backgroundColor: interpolateColor(
      scrollOffsetY.get(),
      [0, Scroll_Distance * 2],
      [THEME[theme].background, THEME[theme].bgLine]
    ),
  }));

  // Vertical parallax for inner content: moves up as header collapses.
  // Output maps 0 → 0px and end → -Scroll_Distance to keep content pinned to the top edge at rest.
  const animatedTranslateContainer = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffsetY.get(),
          [0, Scroll_Distance * 2],
          [0, -Scroll_Distance],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // Fade out large header details to reduce clutter as space tightens.
  // Opacity: 1 → 0 over the same extended range with CLAMP to avoid negative values.
  const animatedOpacityContainer = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffsetY.get(),
      [0, Scroll_Distance * 2],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View
      className="px-4 overflow-hidden"
      style={[{ paddingTop: insets.top + 8 }, animatedHeaderContainer]}
    >
      <Animated.View style={animatedTranslateContainer}>
        <Animated.View style={animatedOpacityContainer}>
          <View className="flex-row flex-wrap items-center justify-between mb-[30]">
            <Text className="font-p-sb text-lg" style={{ color: THEME[theme].text }}>
              👋 Hello
            </Text>
            <View className="flex-row items-center gap-2">
              <Text style={{ color: THEME[theme].text }}>Explore more</Text>
              <Pressable className="p-2 rounded-full bg-pink-400" onPress={simulatePress}>
                <Home
                  size={20}
                  color={theme === "light" ? THEME.dark.text : THEME.light.text}
                  strokeWidth={1.5}
                />
              </Pressable>
            </View>
          </View>
          <Text className="text-2xl font-bold" style={{ color: THEME[theme].text }}>
            Welcome to your
          </Text>
          <Text className="text-2xl font-bold mb-5" style={{ color: THEME[theme].text }}>
            app colors playground!
          </Text>
          <View className="h-px w-full opacity-20 my-3 bg-neutral-500" />
        </Animated.View>
        <View className="flex-row items-center">
          {/* colorsapp-theme-toggle-animation 🔽 */}
          <ThemeToggleButton theme={theme} setTheme={setTheme} />
          {/* colorsapp-theme-toggle-animation 🔼 */}
          <View className="w-2" />
          <Pressable
            className="py-3 px-4 rounded-full"
            style={{ backgroundColor: THEME[theme].bgElement }}
            onPress={simulatePress}
          >
            <Text style={{ color: THEME[theme].text }}>Set colors</Text>
          </Pressable>
        </View>
        <View style={{ height: paddingBottom }} />
      </Animated.View>
    </Animated.View>
  );
};

// colorsapp-home-header-animation 🔼
