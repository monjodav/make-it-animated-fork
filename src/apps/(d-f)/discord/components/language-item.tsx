import React, { FC, memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { LanguageType } from "../lib/types";
import { CustomRadio } from "./custom-radio";

// discord-language-radio-button-animation 🔽

type Props = {
  data: LanguageType;
  selected: boolean;
  onPress: (language: LanguageType) => void;
};

const LanguageItem: FC<Props> = ({ data, selected, onPress }) => {
  const backdropOpacity = useSharedValue(0);

  return (
    <Pressable
      onPressIn={() => backdropOpacity.set(withTiming(1, { duration: 100 }))}
      onPressOut={() => backdropOpacity.set(withTiming(0, { duration: 100 }))}
      onPress={() => onPress(data)}
    >
      <View className="flex-row items-center gap-3 p-4">
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
          className="bg-[#1C1D24]/50"
        />
        <View className="w-7 h-5 rounded-md bg-white/10" />
        <View className="flex-1 gap-2">
          <View className="w-28 h-4 rounded-full bg-white/20" />
          <View className="w-20 h-3 rounded-full bg-white/10" />
        </View>
        <CustomRadio selected={selected} />
      </View>
    </Pressable>
  );
};

export default memo(LanguageItem);

// discord-language-radio-button-animation 🔼
