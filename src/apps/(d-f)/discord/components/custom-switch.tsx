import { Check, X } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  ZoomIn,
} from "react-native-reanimated";

// discord-custom-switch-animation 🔽

const SWITCH_WIDTH = 40;
const SWITCH_THUMB_SIZE = 20;
const SWITCH_HORIZONTAL_PADDING = 3;
const SWITCH_VERTICAL_PADDING = 3;
const SWITCH_HEIGHT = SWITCH_THUMB_SIZE + SWITCH_VERTICAL_PADDING * 2;
const SWITCH_MAX_OFFSET = SWITCH_WIDTH - SWITCH_THUMB_SIZE - SWITCH_HORIZONTAL_PADDING * 2;

const TRACK_DEFAULT_COLOR = "#4E505B";
const TRACK_ACTIVE_COLOR = "#5965F2";
const THUMB_COLOR = "#F5F5F5";

type Props = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export const CustomSwitch: FC<Props> = ({ value = false, onValueChange }) => {
  const offset = useSharedValue(value ? SWITCH_MAX_OFFSET : 0);
  const isOn = useSharedValue(value);

  const toggleSwitch = () => {
    const newValue = !isOn.get();
    isOn.set(newValue);

    offset.set(
      withSpring(newValue ? SWITCH_MAX_OFFSET : 0, {
        damping: 25,
        stiffness: 300,
      })
    );
    onValueChange?.(newValue);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.get() }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.get(),
      [0, SWITCH_MAX_OFFSET],
      [TRACK_DEFAULT_COLOR, TRACK_ACTIVE_COLOR]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Pressable onPress={toggleSwitch}>
      <Animated.View style={[styles.track, backgroundStyle]}>
        <Animated.View
          style={[styles.thumb, animatedStyle]}
          className="items-center justify-center"
        >
          {value ? (
            // NOTE: When you have conditional rendering of few components with entering animation
            // you should use key prop so it works correctly
            <Animated.View key="check" entering={ZoomIn}>
              <Check size={12} color={TRACK_ACTIVE_COLOR} strokeWidth={4} />
            </Animated.View>
          ) : (
            <Animated.View key="x" entering={ZoomIn}>
              <X size={14} color={TRACK_DEFAULT_COLOR} strokeWidth={3} />
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
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

// discord-custom-switch-animation 🔼
