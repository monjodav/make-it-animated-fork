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
import { _loadingIndicatorDiameter, LoadingIndicator } from "./loading-indicator";

export const _onRefreshingContainerHeight = 150;
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

  const loadingIndicatorContainerHeightOnRefreshing = useDerivedValue(() => {
    return listOffsetYOnEndDrag.value < _onRefreshingContainerHeight
      ? withSequence(
          withTiming(listOffsetYOnEndDrag.value, { duration: 0 }),
          withDelay(25, withTiming(_onRefreshingContainerHeight, { duration: 500 }))
        )
      : listOffsetYOnEndDrag.value;
  });

  const loadingIndicatorContainerHeight = useDerivedValue(() => {
    return isDragging.value
      ? interpolate(listOffsetY.value, [0, -height], [0, height], Extrapolation.CLAMP)
      : listOffsetYOnEndDrag.value > _loadingIndicatorDiameter
        ? loadingIndicatorContainerHeightOnRefreshing.value
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
        className="top-0 left-0 right-0 items-center justify-center"
        style={rLoadingIndicatorContainerStyle}
      >
        <LoadingIndicator
          wrapperHeight={loadingIndicatorContainerHeight}
          listOffsetYOnEndDrag={listOffsetYOnEndDrag}
          refreshing={refreshing}
          isRefreshed={isRefreshed}
        />
      </Animated.View>
      {children}
    </View>
  );
};
