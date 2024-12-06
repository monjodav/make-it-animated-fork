import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { _loadingIndicatorDiameter, LoadingIndicator } from "./loading-indicator";

export const _onRefreshCompleteDuration = 500;

type Props = {
  offsetY: SharedValue<number>;
  lastOffsetY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  refreshing: boolean;
  isRefreshed: boolean;
};

export const WithPullToRefresh: FC<PropsWithChildren<Props>> = ({
  children,
  offsetY,
  lastOffsetY,
  isDragging,
  refreshing,
  isRefreshed,
}) => {
  const { height } = useWindowDimensions();

  const loadingIndicatorContainerHeight = useDerivedValue(() => {
    return isDragging.value
      ? interpolate(offsetY.value, [0, -height], [0, height], Extrapolation.CLAMP)
      : lastOffsetY.value > _loadingIndicatorDiameter
        ? lastOffsetY.value
        : withTiming(0, { duration: _onRefreshCompleteDuration });
  });

  const rLoadingIndicatorContainerStyle = useAnimatedStyle(() => {
    return {
      position: isDragging.value ? "absolute" : "relative",
      height: loadingIndicatorContainerHeight.value,
    };
  });

  return (
    <View className="flex-1">
      <Animated.View
        className="top-0 left-0 right-0 items-center justify-center bg-blue-500"
        style={rLoadingIndicatorContainerStyle}
      >
        <LoadingIndicator
          offsetY={loadingIndicatorContainerHeight}
          lastOffsetY={lastOffsetY}
          refreshing={refreshing}
          isRefreshed={isRefreshed}
        />
      </Animated.View>
      {children}
    </View>
  );
};
