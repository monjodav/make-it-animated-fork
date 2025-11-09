import React, { FC, PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Props extends ViewProps {
  width: number;
  height: number;
  className?: string;
  animationConfig?: {
    activeScale?: number;
  };
}

export const RubberContainer: FC<PropsWithChildren<Props>> = ({
  children,
  width,
  height,
  style,
  className,
  animationConfig,
  ...props
}) => {
  const { activeScale = 1.04 } = animationConfig ?? {};

  const isActive = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isActive.set(true);
    })
    .onUpdate((event) => {})
    .onFinalize(() => {
      isActive.set(false);
    });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      width,
      height,
      transform: [
        {
          scale: isActive.get()
            ? withSpring(activeScale, { duration: 600 })
            : withSpring(1, { duration: 1000 }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={className}
        style={[
          {
            width,
            height,
          },
          rContainerStyle,
          style,
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
