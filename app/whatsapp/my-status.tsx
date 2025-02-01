import React, { useState } from "react";
import { Keyboard, Platform, Pressable, TextInput, useWindowDimensions, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { useAnimatedStyle, withDelay, withTiming } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function MyStatus() {
  const [isMounted, setIsMounted] = useState(false);

  const { width, height } = useWindowDimensions();

  const headerHeight = useHeaderHeight();

  const rShadowStyle = useAnimatedStyle(() => {
    if (!isMounted)
      return {
        opacity: 0,
        transform: [{ scale: 1 }],
        height: width / 4,
      };

    return {
      opacity: withTiming(1, { duration: 250 }),
      transform: [{ scale: withTiming(10, { duration: 250 }) }],
      height: withDelay(200, withTiming(height, { duration: 150 })),
    };
  });

  return (
    <View
      className="flex-1 bg-indigo-950"
      style={{ paddingTop: headerHeight }}
      onLayout={() => setIsMounted(true)}
    >
      <Animated.View
        className="absolute bg-indigo-600/70 rounded-full"
        style={[{ width: width / 4, top: width / 2, left: -width / 8 }, rShadowStyle]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 items-center justify-center" onPress={Keyboard.dismiss}>
          <View className="p-4">
            <TextInput
              placeholder="Type a status"
              placeholderTextColor="#ffffff50"
              className="text-3xl text-white font-semibold"
              selectionColor="#ffffff"
              autoFocus
            />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}
