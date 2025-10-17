import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// apple-books-menu-buttons-animation 🔽

// Base delay for staggered animation - controls timing between each button's entrance/exit
const _baseDelay = 50;

type Props = {
  isOpen: boolean;
  index: number;
  numberOfRows: number;
  containerHeight: SharedValue<number>;
};

export const AnimatedRow: FC<PropsWithChildren<Props>> = ({
  isOpen,
  children,
  index,
  numberOfRows,
  containerHeight,
}) => {
  // Staggered entrance: first button enters immediately, subsequent buttons delayed by index * baseDelay
  const onEnterDelay = index * _baseDelay;
  // Staggered exit: reverse order with accelerated timing (1.5x multiplier for quicker collapse)
  const onExitDelay = numberOfRows * _baseDelay - index * _baseDelay * 1.5;
  const delay = isOpen ? onEnterDelay : onExitDelay;

  // Core animation coordinating opacity, translation, and scale with staggered timing
  const rInnerStyle = useAnimatedStyle(() => ({
    // Simple fade in/out with staggered delay
    opacity: withDelay(delay, withTiming(isOpen ? 1 : 0)),
    transform: [
      {
        // Exit translation: buttons move down based on their position in the stack
        // Formula creates proportional spacing - higher buttons move less, lower buttons move more
        translateY: withDelay(
          delay,
          withSpring(
            isOpen
              ? 0 // Enter: return to original position
              : (containerHeight.value - index * (containerHeight.value / numberOfRows)) / 1.5, // Exit: staggered downward movement
            {
              duration: 1500, // Smooth spring animation for natural feel
              dampingRatio: 0.75, // Slight bounce without excessive oscillation
            }
          )
        ),
      },
      {
        // Subtle scale animation enhances the disappearing effect
        scale: withDelay(delay, withTiming(isOpen ? 1 : 0.75)),
      },
    ],
  }));

  return <Animated.View style={[rInnerStyle, styles.container]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    // Transform origin set to right edge - animations scale/transform from the right side
    // Matches Apple Books' menu behavior where buttons appear to emerge from the trigger
    transformOrigin: "right",
  },
});

// apple-books-menu-buttons-animation 🔼
