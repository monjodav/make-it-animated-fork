import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { CircleUser } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolation,
  withDelay,
} from "react-native-reanimated";

// perplexity-header-animation 🔽

const OUTER_DIAMETER = 60;
const INNER_DIAMETER = 40;
const ICON_SIZE = 24;

const BreathingIcon = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1800 }),
          withDelay(500, withTiming(2, { duration: 0 }))
        ),
        -1,
        false
      )
    );
  }, [progress]);

  const rRingStyle = useAnimatedStyle(() => {
    const sizeProgress = interpolate(progress.get(), [0, 0.3, 1], [0, 0.5, 1], Extrapolation.CLAMP);

    const size = INNER_DIAMETER + (OUTER_DIAMETER - INNER_DIAMETER) * sizeProgress;
    const borderWidth = (size - INNER_DIAMETER) / 2;

    const opacity = interpolate(
      progress.get(),
      [0, 0.5, 0.9, 1],
      [0.35, 0.29, 0.1, 0],
      Extrapolation.CLAMP
    );

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth,
      opacity,
    };
  });

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          className="absolute border-[#22d3ee]"
          style={rRingStyle}
        />
      </View>
      <CircleUser size={ICON_SIZE} color="white" />
    </>
  );
};

export default BreathingIcon;

const styles = StyleSheet.create({
  container: {
    width: OUTER_DIAMETER,
    height: OUTER_DIAMETER,
    position: "absolute",
    left: -(OUTER_DIAMETER - ICON_SIZE) / 2,
    top: -(OUTER_DIAMETER - ICON_SIZE) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

// perplexity-header-animation 🔼
