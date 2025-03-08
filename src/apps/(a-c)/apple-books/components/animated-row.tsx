import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// apple-books-menu-buttons-animation 🔽

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
  const onEnterDelay = index * _baseDelay;
  const onExitDelay = numberOfRows * _baseDelay - index * _baseDelay * 1.5;
  const delay = isOpen ? onEnterDelay : onExitDelay;

  const rInnerStyle = useAnimatedStyle(() => ({
    opacity: withDelay(delay, withTiming(isOpen ? 1 : 0)),
    transform: [
      {
        translateY: withDelay(
          delay,
          withSpring(
            isOpen
              ? 0
              : (containerHeight.value - index * (containerHeight.value / numberOfRows)) / 1.5,
            {
              duration: 1500,
              dampingRatio: 0.8,
              stiffness: 200,
            }
          )
        ),
      },
      {
        scale: withDelay(delay, withTiming(isOpen ? 1 : 0.75)),
      },
    ],
  }));

  return (
    <View>
      <Animated.View style={[rInnerStyle, styles.container]}>{children}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    transformOrigin: "right",
  },
});

// apple-books-menu-buttons-animation 🔼
