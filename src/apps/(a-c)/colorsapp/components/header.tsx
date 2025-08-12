import React, { FC } from "react";

import { ArrowLeft } from "lucide-react-native";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { colorKit } from "reanimated-color-picker";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// colorsapp-color-picker-background-animation 🔽

type Props = {
  inputColor: string;
  selectedColor: SharedValue<string>;
};

export const Header: FC<Props> = ({ inputColor, selectedColor }) => {
  // Uppercase the selected hex on UI thread to keep text changes in lockstep with color changes.
  const rSelectedColor = useDerivedValue(() => {
    return selectedColor.get().toUpperCase();
  });

  // Keep the chip background in sync with the live selected color.
  const rSelectedColorContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.get(),
  }));

  // Determine readable text color based on current background.
  // runOnUI ensures contrast check stays on UI thread for zero jank during scrubbing.
  const rSelectedColorTextStyle = useAnimatedStyle(() => ({
    color: colorKit.runOnUI().isDark(selectedColor.get()) ? "#fff" : "#333",
  }));

  return (
    <View className="h-8 px-4 items-center justify-center">
      <View className="h-8 flex-row rounded-full overflow-hidden">
        <View
          className="w-[80] items-center justify-center"
          style={{ backgroundColor: inputColor }}
        >
          <Text style={[styles.text, { color: colorKit.isDark(inputColor) ? "#fff" : "#333" }]}>
            {inputColor.toUpperCase()}
          </Text>
        </View>
        <View className="w-[2px]" />
        <Animated.View className="w-[80] pl-3 justify-center" style={rSelectedColorContainerStyle}>
          <ReText
            text={rSelectedColor}
            style={[styles.text, styles.selectedColorText, rSelectedColorTextStyle]}
            verticalAlign="middle"
          />
        </Animated.View>
      </View>
      {/** Lightweight back control for demos; replaced by navigation in real screen. */}
      <TouchableOpacity className="absolute top-0 left-4" onPress={simulatePress}>
        <ArrowLeft size={30} color="#fff" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
  selectedColorText: {
    // iOS measures differently; small platform tweak avoids vertical clipping for ReText.
    lineHeight: Platform.OS === "ios" ? 14 : 6,
  },
});

// colorsapp-color-picker-background-animation 🔼
