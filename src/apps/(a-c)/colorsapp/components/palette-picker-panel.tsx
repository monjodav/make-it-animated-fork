import React, { FC } from "react";

import { useWindowDimensions, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { sharedConfigs } from "../lib/constants/palette-picker-color-change-animation";
import { BrightnessSlider } from "reanimated-color-picker";
import { ColorItem } from "./color-item";
import { ColorPanel } from "./color-panel";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// colorsapp-palette-picker-color-change-animation 🔽

const BASE_DURATION = 1500;

type Props = {
  state: SharedValue<"idle" | "active">;
  lightShadeColor: SharedValue<string>;
  lightAccentColor: SharedValue<string>;
  primaryColor: SharedValue<string>;
  darkAccentColor: SharedValue<string>;
  darkShadeColor: SharedValue<string>;
};

export const PalettePickerPanel: FC<Props> = ({
  state,
  lightShadeColor,
  lightAccentColor,
  primaryColor,
  darkAccentColor,
  darkShadeColor,
}) => {
  const { width } = useWindowDimensions();

  const _circleWidth = width - 32;

  const rCircle1Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          state.value === "idle"
            ? withTiming(1.25, { duration: BASE_DURATION })
            : withRepeat(
                withSequence(
                  withTiming(2.5, { duration: BASE_DURATION * 1.25 }),
                  withTiming(1.25, { duration: BASE_DURATION * 0.75 })
                ),
                -1,
                true
              ),
      },
    ],
    opacity: withDelay(
      BASE_DURATION / 2,
      withTiming(state.value === "idle" ? 0.25 : 0.5, { duration: BASE_DURATION })
    ),
  }));

  const rCircle2Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          state.value === "idle"
            ? withTiming(1.1, { duration: BASE_DURATION })
            : withRepeat(
                withSequence(
                  withTiming(1.5, { duration: BASE_DURATION * 1.25 }),
                  withTiming(1.1, { duration: BASE_DURATION * 0.75 })
                ),
                -1,
                true
              ),
      },
    ],
    opacity: withDelay(
      BASE_DURATION / 2,
      withTiming(state.value === "idle" ? 0.25 : 0.5, { duration: BASE_DURATION })
    ),
  }));

  const rCircle3Style = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          state.value === "idle"
            ? withTiming(1, { duration: BASE_DURATION })
            : withRepeat(
                withSequence(
                  withTiming(1.2, { duration: BASE_DURATION * 1.25 }),
                  withTiming(1, { duration: BASE_DURATION * 0.75 })
                ),
                -1,
                true
              ),
      },
    ],
    opacity: withDelay(
      BASE_DURATION / 4,
      withTiming(state.value === "idle" ? 0 : 0.5, { duration: BASE_DURATION })
    ),
  }));

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Animated.View
          className="absolute w-[200] h-[200] rounded-full bg-zinc-800/20"
          style={[{ width: _circleWidth, height: _circleWidth }, rCircle1Style]}
        />
        <Animated.View
          className="absolute w-[200] h-[200] rounded-full bg-zinc-800/20"
          style={[{ width: _circleWidth, height: _circleWidth }, rCircle2Style]}
        />
        <Animated.View
          className="absolute w-[200] h-[200] rounded-full border border-zinc-400/20"
          style={[{ width: _circleWidth, height: _circleWidth }, rCircle3Style]}
        />
        <ColorPanel
          state={state}
          lightAccentColor={lightAccentColor}
          darkAccentColor={darkAccentColor}
        />
      </View>
      <View className="px-4 pb-8 pt-4">
        <BrightnessSlider
          thumbShape="circle"
          sliderThickness={sharedConfigs.sliderThickness}
          thumbSize={sharedConfigs.thumbSliderSize}
        />
      </View>
      <View className="flex-row w-full px-4 gap-1">
        <ColorItem color={lightShadeColor} handleEditPress={simulatePress} />
        <ColorItem color={lightAccentColor} />
        <ColorItem color={primaryColor} handleEditPress={simulatePress} />
        <ColorItem color={darkAccentColor} />
        <ColorItem color={darkShadeColor} handleEditPress={simulatePress} />
      </View>
    </View>
  );
};

// colorsapp-palette-picker-color-change-animation 🔼
