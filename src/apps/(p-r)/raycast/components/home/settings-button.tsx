import React, { FC, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  CANCEL_CONTAINER_WIDTH,
  SETTINGS_CONTAINER_WIDTH,
} from "../../lib/providers/home-animation";
import { Alert, StyleSheet } from "react-native";
import { Image } from "expo-image";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SettingsButton: FC = () => {
  const width = useSharedValue(CANCEL_CONTAINER_WIDTH);

  useEffect(() => {
    width.set(withTiming(SETTINGS_CONTAINER_WIDTH));
  }, []);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  return (
    <AnimatedPressable
      entering={FadeIn}
      exiting={FadeOut}
      onPress={() => Alert.alert("Settings")}
      className="items-center justify-center"
      style={rContainerStyle}
    >
      <Image placeholder={{ blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" }} style={styles.image} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
  },
});
