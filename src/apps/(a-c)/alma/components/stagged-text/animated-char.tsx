import { FC } from "react";
import { Text } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

// alma-onboarding-carousel-animation 🔽

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

  return (
    <Animated.View style={rContainerStyle}>
      <Text className="text-3xl font-semibold" style={{ fontFamily: "LibreBaskerville_700Bold" }}>
        {char}
      </Text>
    </Animated.View>
  );
};

// alma-onboarding-carousel-animation 🔼
