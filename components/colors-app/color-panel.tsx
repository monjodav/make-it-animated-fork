import { sharedConfigs } from "@/constants/colors-app/palette-picker-color-change-animation";
import React, { FC } from "react";

import { useWindowDimensions } from "react-native";
import Animated, {
  FadeOut,
  RotateInDownLeft,
  RotateInDownRight,
  SharedValue,
} from "react-native-reanimated";
import { colorKit, ExtraThumb, Panel3, returnedResults } from "reanimated-color-picker";
import colors from "tailwindcss/colors";

// colorsapp-palette-picker-color-change-animation 🔽

type Props = {
  state: SharedValue<"idle" | "active">;
  lightAccentColor: SharedValue<string>;
  darkAccentColor: SharedValue<string>;
};

export const ColorPanel: FC<Props> = ({ state, lightAccentColor, darkAccentColor }) => {
  const randomNumber = Math.ceil(Math.random() * 100);

  const { width } = useWindowDimensions();

  const _width = width - 32;

  return (
    <Animated.View
      onTouchStart={() => (state.value = "active")}
      onTouchEnd={() => (state.value = "idle")}
      entering={
        randomNumber % 2 === 0 ? RotateInDownLeft.duration(500) : RotateInDownRight.duration(500)
      }
      exiting={FadeOut}
    >
      <Panel3
        style={{ width: _width, height: _width }}
        adaptSpectrum
        thumbSize={sharedConfigs.thumbPanelSize}
        centerChannel="saturation"
        thumbShape="ring"
      >
        <ExtraThumb
          key="lightAccentBase"
          thumbShape="solid"
          thumbSize={sharedConfigs.thumbSliderSize * 0.75}
          thumbColor={colorKit.setAlpha(colors.zinc[800], 0.25).hex()}
          hueTransform={120}
          onChange={(colors: returnedResults) => {
            "worklet";
            lightAccentColor.value = colors.hex;
          }}
        />
        <ExtraThumb
          key="darkAccentBase"
          thumbShape="solid"
          thumbSize={sharedConfigs.thumbSliderSize * 0.75}
          thumbColor={colorKit.setAlpha(colors.zinc[800], 0.25).hex()}
          hueTransform={240}
          onChange={(colors: returnedResults) => {
            "worklet";
            darkAccentColor.value = colors.hex;
          }}
        />
      </Panel3>
    </Animated.View>
  );
};

// colorsapp-palette-picker-color-change-animation 🔼
