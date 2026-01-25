import { FC, ReactNode } from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

// daily-steps-counter-animation 🔽

const HIGHLIGHT_ANIMATION_DURATION = 150;
const MIN_SCALE = 0.9;
const MAX_SCALE = 1.05;

type CounterButtonProps = {
  onPress: () => void;
  icon: ReactNode;
};

export const CounterButton: FC<CounterButtonProps> = ({ onPress, icon }) => {
  const pressProgress = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressProgress.get(),
      [0, 1],
      [MIN_SCALE, MAX_SCALE],
      Extrapolation.CLAMP,
    );

    return {
      opacity: pressProgress.get(),
      transform: [{ scale }],
    };
  });

  const handlePressIn = () => {
    pressProgress.set(withTiming(1, { duration: HIGHLIGHT_ANIMATION_DURATION }));
  };

  const handlePressOut = () => {
    pressProgress.set(withTiming(0, { duration: HIGHLIGHT_ANIMATION_DURATION }));
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="px-4 py-2 items-center justify-center relative"
    >
      <Animated.View
        className="absolute inset-0 rounded-xl bg-white/50"
        style={[overlayStyle, { borderCurve: "continuous" }]}
      />
      {icon}
    </Pressable>
  );
};

// daily-steps-counter-animation 🔼
