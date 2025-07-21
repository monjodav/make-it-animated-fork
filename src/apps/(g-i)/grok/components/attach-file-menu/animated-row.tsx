import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// grok-attach-file-menu-animation 🔽

const SPRING_CONFIG = { damping: 40, stiffness: 300 };

type Props = {
  isMenuOpen: SharedValue<boolean>;
  index: number;
  numberOfRows: number;
  containerHeight: SharedValue<number>;
};

export const AnimatedRow: FC<PropsWithChildren<Props>> = ({
  children,
  isMenuOpen,
  index,
  numberOfRows,
  containerHeight,
}) => {
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isMenuOpen.get() ? 0 : -20, SPRING_CONFIG),
        },
        {
          translateY: withSpring(
            isMenuOpen.get()
              ? 0
              : containerHeight.value - index * (containerHeight.value / numberOfRows),
            SPRING_CONFIG
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[rContainerStyle, styles.container]} className="overflow-hidden">
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    transformOrigin: "left",
  },
});

// grok-attach-file-menu-animation 🔼
