import React, { FC, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const ENTER_SPRING_CONFIG = { damping: 40, stiffness: 300 };

type Props = {
  isMenuOpen: SharedValue<boolean>;
  index: number;
  numberOfRows: number;
  containerHeight: SharedValue<number>;
};

export const AnimatedRow: FC<PropsWithChildren<Props>> = ({
  isMenuOpen,
  children,
  index,
  numberOfRows,
  containerHeight,
}) => {
  const rInnerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isMenuOpen.get() ? 0 : -20, ENTER_SPRING_CONFIG),
        },
        {
          translateY: withSpring(
            isMenuOpen.get()
              ? 0
              : containerHeight.value - index * (containerHeight.value / numberOfRows),
            ENTER_SPRING_CONFIG
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[rInnerStyle, styles.container]} className="overflow-hidden">
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    transformOrigin: "left",
  },
});
