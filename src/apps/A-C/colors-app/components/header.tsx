import React, { FC } from "react";

import { ArrowLeft } from "lucide-react-native";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { colorKit } from "reanimated-color-picker";

// colorsapp-color-picker-background-animation 🔽

type Props = {
  inputColor: string;
  selectedColor: SharedValue<string>;
};

export const Header: FC<Props> = ({ inputColor, selectedColor }) => {
  const rSelectedColor = useDerivedValue(() => {
    return selectedColor.value.toUpperCase();
  });

  const rSelectedColorContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const rSelectedColorTextStyle = useAnimatedStyle(() => ({
    color: colorKit.runOnUI().isDark(selectedColor.value) ? "#fff" : "#333",
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
          <ReText text={rSelectedColor} style={[styles.text, rSelectedColorTextStyle]} />
        </Animated.View>
      </View>
      <TouchableOpacity className="absolute top-0 left-4" onPress={() => Alert.alert("Back")}>
        <ArrowLeft size={30} color="#fff" strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

// colorsapp-color-picker-background-animation 🔼
