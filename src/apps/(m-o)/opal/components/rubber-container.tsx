import React, { FC, PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureType } from "react-native-gesture-handler";

const ON_FINALIZE_SPRING_CONFIG = {
  damping: 65,
  stiffness: 900,
};

interface Props extends ViewProps {
  width: number;
  height: number;
  className?: string;
  animationConfig?: {
    activeScale?: number;
    baseDistance?: number;
    maxScale?: number;
    stretchRatio?: number;
  };
  gestures?: GestureType[];
}

export const RubberContainer: FC<PropsWithChildren<Props>> = ({
  children,
  width,
  height,
  style,
  className,
  animationConfig,
  gestures,
  ...props
}) => {
  const {
    activeScale = 1.04,
    baseDistance = 100,
    maxScale = 2.5,
    stretchRatio = 2.5,
  } = animationConfig ?? {};

  const isActive = useSharedValue(false);
  const lastX = useSharedValue(0);
  const transformOrigin = useSharedValue("left");

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isActive.set(true);
      lastX.set(event.x);
    })
    .onChange((event) => {
      const x = event.x;
      lastX.set(x);

      if (x > width / 2) {
        transformOrigin.set("left");
      } else {
        transformOrigin.set("right");
      }
    })
    .onFinalize(() => {
      isActive.set(false);

      if (lastX.get() > 0 && lastX.get() < width) {
        return;
      }

      if (transformOrigin.get() === "left") {
        lastX.set(withSpring(width, ON_FINALIZE_SPRING_CONFIG, () => lastX.set(0)));
      } else {
        lastX.set(withSpring(0, ON_FINALIZE_SPRING_CONFIG));
      }
    });

  const composedGestures = Gesture.Simultaneous(gesture, ...(gestures ?? []));

  const rOnActiveScaleContainerStyle = useAnimatedStyle(() => {
    return {
      width,
      height,
      transform: [
        {
          scale: isActive.get()
            ? withSpring(activeScale, { duration: 600 })
            : withSpring(1, { duration: 1000, dampingRatio: 0.3 }),
        },
      ],
    };
  });

  const rStretchContainerStyle = useAnimatedStyle(() => {
    const maxWidth = baseDistance * maxScale * stretchRatio;

    const scaleX = interpolate(
      lastX.get(),
      [-maxWidth, 0, width, width + maxWidth],
      [maxScale, 1, 1, maxScale],
      Extrapolation.CLAMP
    );

    const scaleY = interpolate(
      lastX.get(),
      [-width * 0.1, 0, width, width + width * 0.1],
      [0.95, 1, 1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      transformOrigin: transformOrigin.get(),
      transform: [
        {
          scaleY,
        },
        {
          scaleX,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View
        className={className}
        style={[
          {
            width,
            height,
          },
          rOnActiveScaleContainerStyle,
          style,
        ]}
        {...props}
      >
        <Animated.View className="flex-1" style={rStretchContainerStyle}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
