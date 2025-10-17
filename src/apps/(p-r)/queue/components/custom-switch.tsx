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

// Physical dimensions for switch consistency
const SWITCH_WIDTH = 54; // Total switch track width
const SWITCH_THUMB_SIZE = 26; // Circular thumb diameter
const SWITCH_HORIZONTAL_PADDING = 6; // Internal spacing from edges
const SWITCH_VERTICAL_PADDING = 6; // Top/bottom internal spacing
const SWITCH_BORDER_WIDTH = 0.5; // Subtle border for depth

// Calculated height ensures thumb fits with padding + borders
const SWITCH_HEIGHT = SWITCH_THUMB_SIZE + SWITCH_VERTICAL_PADDING * 2 + 2 * SWITCH_BORDER_WIDTH;

// Maximum thumb translation distance: width - thumb size - padding on both sides
const SWITCH_MAX_OFFSET = SWITCH_WIDTH - SWITCH_THUMB_SIZE - SWITCH_HORIZONTAL_PADDING * 2;

// Color scheme: dark off state to green active state
const DEFAULT_TRACK_COLOR = "#1F2024"; // Dark gray (off state)
const DEFAULT_ACTIVE_TRACK_COLOR = "#31D159"; // Green (on state)
const THUMB_COLOR = "#F5F5F5"; // Light gray thumb (constant)

type Props = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export const CustomSwitch: FC<Props> = ({ value = false, onValueChange }) => {
  // Thumb position: 0 (left/off) to SWITCH_MAX_OFFSET (right/on)
  const offset = useSharedValue(value ? SWITCH_MAX_OFFSET : 0);
  // Boolean state tracked in UI thread for immediate access
  const isOn = useSharedValue(value);

  const toggleSwitch = () => {
    // Light haptic feedback for tactile switch feeling
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !isOn.get();
    isOn.set(newValue);

    // Spring animation with moderate bounce for natural feel
    offset.set(withSpring(newValue ? SWITCH_MAX_OFFSET : 0));
    onValueChange?.(newValue);
  };

  // Thumb position animation: slides horizontally based on offset value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.get() }], // 0px (off) to SWITCH_MAX_OFFSET px (on)
    };
  });

  // Track color animation: interpolates between off/on colors as thumb moves
  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.get(), // Input: current thumb position
      [0, SWITCH_MAX_OFFSET], // Input range: left position to right position
      [DEFAULT_TRACK_COLOR, DEFAULT_ACTIVE_TRACK_COLOR] // Output: dark gray to green
    );

    return {
      backgroundColor, // Smooth color transition synchronized with thumb movement
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
    borderWidth: SWITCH_BORDER_WIDTH,
    borderColor: "#2C2B2F",
    borderCurve: "continuous",
    paddingHorizontal: SWITCH_HORIZONTAL_PADDING,
    paddingVertical: SWITCH_VERTICAL_PADDING,
  },
  thumb: {
    width: SWITCH_THUMB_SIZE,
    height: SWITCH_THUMB_SIZE,
    borderRadius: SWITCH_THUMB_SIZE / 2,
    backgroundColor: THUMB_COLOR,
  },
});

// queue-custom-switch-animation 🔼
