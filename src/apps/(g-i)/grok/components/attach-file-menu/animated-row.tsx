import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// grok-attach-file-menu-animation 🔽

// Spring configuration for natural, bouncy menu item entrance
// damping: 40 prevents excessive oscillation, stiffness: 300 provides snappy response
const SPRING_CONFIG = { damping: 120, stiffness: 1000 };

type Props = {
  isMenuOpen: SharedValue<boolean>;
  index: number; // Row position (0-based) for calculating slide distance
  numberOfRows: number; // Total rows for proportional slide calculation
  containerHeight: SharedValue<number>; // Container height for slide distance calculation
};

export const AnimatedRow: FC<PropsWithChildren<Props>> = ({
  children,
  isMenuOpen,
  index,
  numberOfRows,
  containerHeight,
}) => {
  // Dual-axis slide animation: horizontal slide-in + vertical collapse effect
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Horizontal slide: -20px creates subtle left-to-right entrance
          translateX: withSpring(isMenuOpen.get() ? 0 : -20, SPRING_CONFIG),
        },
        {
          // Vertical slide: each row slides from its proportional position
          // Formula: containerHeight - (index * rowHeight) creates staggered collapse
          translateY: withSpring(
            isMenuOpen.get()
              ? 0 // Final position when open
              : containerHeight.value - index * (containerHeight.value / numberOfRows), // Collapsed position close to trigger btn
            SPRING_CONFIG
          ),
        },
      ],
    };
  });

  return <Animated.View style={[rContainerStyle, styles.container]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    transformOrigin: "left", // Ensures transforms originate from left edge for consistent slide direction
  },
});

// grok-attach-file-menu-animation 🔼
