import { FC } from "react";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

type AnimatedDigitProps = {
  index: number;
  animatedIndex: SharedValue<number>;
};

export const AnimatedDigit: FC<AnimatedDigitProps> = ({ index, animatedIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.get(),
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      animatedIndex.get(),
      [index - 1, index, index + 1],
      [0.6, 1, 0.6],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.Text className="text-white text-5xl font-bold" style={animatedStyle}>
      {index}
    </Animated.Text>
  );
};
