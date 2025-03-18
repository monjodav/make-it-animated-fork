import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";

// queue-custom-switch-animation 🔽

const SWITCH_WIDTH = 54;
const SWITCH_THUMB_SIZE = 26;
const SWITCH_HORIZONTAL_PADDING = 6;
const SWITCH_VERTICAL_PADDING = 6;
const SWITCH_HEIGHT = SWITCH_THUMB_SIZE + SWITCH_VERTICAL_PADDING * 2;
const SWITCH_MAX_OFFSET = SWITCH_WIDTH - SWITCH_THUMB_SIZE - SWITCH_HORIZONTAL_PADDING * 2;

type Props = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export const CustomSwitch: FC<Props> = ({ value = false, onValueChange }) => {
  const offset = useSharedValue(value ? SWITCH_MAX_OFFSET : 0);
  const isOn = useSharedValue(value);

  const toggleSwitch = () => {
    const newValue = !isOn.value;
    isOn.value = newValue;

    if (newValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    offset.value = withSpring(newValue ? SWITCH_MAX_OFFSET : 0, {
      damping: 20,
      stiffness: 180,
    });
    onValueChange?.(newValue);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.value,
      [0, SWITCH_MAX_OFFSET],
      ["#1F2024", "#31D159"]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Pressable onPress={toggleSwitch}>
      <Animated.View style={[styles.track, backgroundStyle]}>
        <Animated.View style={[styles.thumb, animatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: 0.5,
    borderColor: "#2C2B2F",
    borderCurve: "continuous",
    paddingHorizontal: SWITCH_HORIZONTAL_PADDING,
    paddingVertical: SWITCH_VERTICAL_PADDING,
  },
  thumb: {
    width: SWITCH_THUMB_SIZE,
    height: SWITCH_THUMB_SIZE,
    borderRadius: SWITCH_THUMB_SIZE / 2,
    backgroundColor: "#F5F5F5",
  },
});

// queue-custom-switch-animation 🔼
