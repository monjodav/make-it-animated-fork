import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const _baseDelay = 50;

type Props = {
  isOpen: boolean;
  rowNumber: number;
  totalRows: number;
  containerHeight: SharedValue<number>;
};

export const AnimatedRow: FC<PropsWithChildren<Props>> = ({
  isOpen,
  children,
  rowNumber,
  totalRows,
  containerHeight,
}) => {
  const rInnerStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      isOpen ? rowNumber * _baseDelay : totalRows * _baseDelay - rowNumber * _baseDelay * 1.5,
      withTiming(isOpen ? 1 : 0, { duration: 300 })
    ),
    transform: [
      {
        translateY: withDelay(
          isOpen ? rowNumber * _baseDelay : totalRows * _baseDelay - rowNumber * _baseDelay * 1.5,
          withSpring(
            isOpen
              ? 0
              : (containerHeight.value - rowNumber * (containerHeight.value / totalRows)) / 1.5,
            {
              duration: 1500,
              dampingRatio: 0.8,
              stiffness: 200,
            }
          )
        ),
      },
      {
        scale: withDelay(
          isOpen ? rowNumber * _baseDelay : totalRows * _baseDelay - rowNumber * _baseDelay * 1.5,
          withTiming(isOpen ? 1 : 0.75, { duration: 350 })
        ),
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
