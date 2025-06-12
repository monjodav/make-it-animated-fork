import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";

// discord-language-radio-button-animation 🔽

const INACTIVE_RING_SIZE = 24;
const INACTIVE_RING_WIDTH = 2;
const INACTIVE_RING_COLOR = "#C7C8CE";

const ACTIVE_RING_SIZE = INACTIVE_RING_SIZE;
const ACTIVE_RING_COLOR = "#5965F2";
const ACTIVE_DOT_SIZE = INACTIVE_RING_SIZE * 0.45;
const ACTIVE_DOT_COLOR = "#F5F5F5";

const DURATION = 150;

type Props = {
  selected: boolean;
};

export const CustomRadio: FC<Props> = ({ selected }) => {
  const rActiveStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(selected ? 1 : 0, {
        duration: DURATION * 2,
        easing: Easing.out(Easing.ease),
      }),
      transform: [
        {
          scale: withTiming(selected ? 1 : 0.5, {
            duration: DURATION,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.inactiveRing} className="items-center justify-center">
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.activeRing, rActiveStyle]}
        className="items-center justify-center"
      >
        <Animated.View style={styles.activeDot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  inactiveRing: {
    width: INACTIVE_RING_SIZE,
    height: INACTIVE_RING_SIZE,
    borderRadius: INACTIVE_RING_SIZE / 2,
    borderWidth: INACTIVE_RING_WIDTH,
    borderColor: INACTIVE_RING_COLOR,
  },
  activeRing: {
    position: "absolute",
    top: -INACTIVE_RING_WIDTH,
    left: -INACTIVE_RING_WIDTH,
    width: ACTIVE_RING_SIZE,
    height: ACTIVE_RING_SIZE,
    borderRadius: ACTIVE_RING_SIZE / 2,
    backgroundColor: ACTIVE_RING_COLOR,
  },
  activeDot: {
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    backgroundColor: ACTIVE_DOT_COLOR,
  },
});

// discord-language-radio-button-animation 🔼
