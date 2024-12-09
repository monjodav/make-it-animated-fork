import { sharedConfigs } from "@/constants/pinterest/pull-to-refresh-animation";
import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LoadingIndicator, LoadingIndicatorProps } from "./loading-indicator";

// pinterest-pull-to-refresh-loading-animation 🔽

type Props = Pick<LoadingIndicatorProps, "refreshing" | "isRefreshed"> & {
  listOffsetY: SharedValue<number>;
  listOffsetYOnEndDrag: SharedValue<number>;
  isDragging: SharedValue<boolean>;
};

export const WithPullToRefresh: FC<PropsWithChildren<Props>> = ({
  children,
  listOffsetY,
  listOffsetYOnEndDrag,
  isDragging,
  refreshing,
  isRefreshed,
}) => {
  const { height } = useWindowDimensions();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: refreshing.value === true ? "none" : "auto",
    };
  });

  const wrapperHeightOnRefreshing = useDerivedValue(() => {
    return withSequence(
      withTiming(listOffsetYOnEndDrag.value, { duration: 0 }),
      withSpring(sharedConfigs.wrapperHeightOnRefreshing, sharedConfigs.onRefreshingSpringConfigs)
    );
  });

  const wrapperHeight = useDerivedValue(() => {
    return isDragging.value
      ? interpolate(listOffsetY.value, [0, -height], [0, height], Extrapolation.CLAMP)
      : refreshing.value === true
        ? wrapperHeightOnRefreshing.value
        : withTiming(0, {
            duration: sharedConfigs.onRefreshCompleteDuration,
            easing: Easing.out(Easing.quad),
          });
  });

  const rWrapperStyle = useAnimatedStyle(() => {
    return {
      position: isDragging.value === true ? "absolute" : "relative",
      height: wrapperHeight.value,
    };
  });

  return (
    <Animated.View className="flex-1" style={rContainerStyle}>
      <Animated.View
        className="top-0 left-0 right-0 items-center justify-center"
        style={rWrapperStyle}
      >
        <LoadingIndicator
          wrapperHeight={wrapperHeight}
          refreshing={refreshing}
          isRefreshed={isRefreshed}
        />
      </Animated.View>
      {children}
    </Animated.View>
  );
};

// pinterest-pull-to-refresh-loading-animation 🔼
