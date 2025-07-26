import { BlurView } from "expo-blur";
import { FC } from "react";
import { Platform, StyleSheet, Text } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type Props = {
  char: string;
  index: number;
  totalCount: number;
  progress: SharedValue<number>;
};

export const AnimatedChar: FC<Props> = ({ index, char, progress, totalCount }) => {
  const charProgress = useDerivedValue(() => {
    const delayMs = index * 10;

    return withDelay(
      delayMs,
      withSpring(progress.value, {
        damping: 18,
        stiffness: 500,
      })
    );
  }, []);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: charProgress.get(),
      transform: [
        {
          translateX: interpolate(charProgress.get(), [0, 1], [-1, 0]),
        },
        {
          translateY: interpolate(
            charProgress.get(),
            [0, 1],
            [16 - index * (8 / Math.max(totalCount - 1, 1)), 0]
          ),
        },
        {
          scale: interpolate(charProgress.get(), [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  const backdropAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(charProgress.get(), [0.5, 1], [6, 0], {
      extrapolateLeft: "clamp",
    });
    return {
      intensity,
    };
  });

  return (
    <Animated.View style={rContainerStyle}>
      <Text className="text-3xl font-semibold" style={{ fontFamily: "LibreBaskerville_700Bold" }}>
        {char}
      </Text>
      {Platform.OS === "ios" && (
        <AnimatedBlurView
          animatedProps={backdropAnimatedProps}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      )}
    </Animated.View>
  );
};
