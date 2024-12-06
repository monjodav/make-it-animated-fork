import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions, View } from "react-native";
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

export const _loadingIndicatorDiameter = 44;
export const _refreshingTriggerOffset = _loadingIndicatorDiameter;

export const _wrapperHeightOnRefreshing = 180;
export const _wrapperHeightOnRefreshingAnimDuration = 350;

export const _onRefreshCompleteDuration = 500;

export const _onRefreshingConfigs = {
  mass: 0.75,
  damping: 8,
  stiffness: 100,
};

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

  const wrapperHeightOnRefreshing = useDerivedValue(() => {
    return withSequence(
      withTiming(listOffsetYOnEndDrag.value, { duration: 0 }),
      withSpring(_wrapperHeightOnRefreshing, _onRefreshingConfigs)
    );
  });

  const wrapperHeight = useDerivedValue(() => {
    return isDragging.value
      ? interpolate(listOffsetY.value, [0, -height], [0, height], Extrapolation.CLAMP)
      : refreshing.value === true
        ? wrapperHeightOnRefreshing.value
        : withTiming(0, { duration: _onRefreshCompleteDuration, easing: Easing.out(Easing.quad) });
  });

  const rWrapperStyle = useAnimatedStyle(() => {
    return {
      position: isDragging.value === true ? "absolute" : "relative",
      height: wrapperHeight.value,
    };
  });

  return (
    <View className="flex-1">
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
    </View>
  );
};
