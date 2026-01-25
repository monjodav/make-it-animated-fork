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

// Press animation timing: fast enough to feel responsive, slow enough to be visible
const HIGHLIGHT_ANIMATION_DURATION = 150;
// Scale range creates subtle press feedback: slight shrink on press, slight grow on release
const MIN_SCALE = 0.9;
const MAX_SCALE = 1.05;

type CounterButtonProps = {
  onPress: () => void;
  icon: ReactNode;
};

export const CounterButton: FC<CounterButtonProps> = ({ onPress, icon }) => {
  // Tracks press state: 0 = not pressed, 1 = fully pressed
  const pressProgress = useSharedValue(0);

  // Overlay animation: white highlight with scale effect
  // Scale interpolation: maps progress [0, 1] to scale [MIN_SCALE, MAX_SCALE]
  // Input range: 0 (released) to 1 (pressed)
  // Output range: MIN_SCALE (0.9) to MAX_SCALE (1.05)
  // CLAMP prevents values outside [0, 1] range
  // Opacity matches progress for fade in/out effect
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

  // Press handlers animate overlay visibility and scale
  // Press in: animate to 1 (show overlay, scale up)
  // Press out: animate to 0 (hide overlay, scale down)
  const handlePressIn = () => {
    pressProgress.set(withTiming(1, { duration: HIGHLIGHT_ANIMATION_DURATION }));
  };

  const handlePressOut = () => {
    pressProgress.set(withTiming(0, { duration: HIGHLIGHT_ANIMATION_DURATION }));
  };

  // Animated.View overlay provides visual feedback during press
  // borderCurve: "continuous" creates smooth rounded corners on iOS
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
