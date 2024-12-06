import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LoadingIndicator } from "./loading-indicator";

export const _loadingIndicatorDiameter = 44;
export const _refreshingTriggerOffset = _loadingIndicatorDiameter;
export const _wrapperHeightOnRefreshing = 150;

export const _onRefreshCompleteDuration = 500;

type Props = {
  listOffsetY: SharedValue<number>;
  listOffsetYOnEndDrag: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  refreshing: SharedValue<boolean>;
  isRefreshed: SharedValue<boolean>;
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
    return listOffsetYOnEndDrag.value < _wrapperHeightOnRefreshing
      ? withSequence(
          withTiming(listOffsetYOnEndDrag.value, { duration: 0 }),
          withDelay(25, withTiming(_wrapperHeightOnRefreshing, { duration: 500 }))
        )
      : listOffsetYOnEndDrag.value;
  });

  const wrapperHeight = useDerivedValue(() => {
    return isDragging.value
      ? interpolate(listOffsetY.value, [0, -height], [0, height], Extrapolation.CLAMP)
      : refreshing.value === true
        ? wrapperHeightOnRefreshing.value
        : withTiming(0, { duration: _onRefreshCompleteDuration });
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
          listOffsetYOnEndDrag={listOffsetYOnEndDrag}
          refreshing={refreshing}
          isRefreshed={isRefreshed}
        />
      </Animated.View>
      {children}
    </View>
  );
};
