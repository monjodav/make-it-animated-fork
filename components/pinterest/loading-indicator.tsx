import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const _loadingIndicatorDiameter = 44;

const className = {
  dot: "w-[5px] h-[5px] rounded-full bg-black",
};

type Props = {
  wrapperHeight: SharedValue<number>;
  listOffsetYOnEndDrag: SharedValue<number>;
  refreshing: SharedValue<boolean>;
  isRefreshed: SharedValue<boolean>;
};

export const LoadingIndicator: FC<Props> = ({
  wrapperHeight,
  listOffsetYOnEndDrag,
  refreshing,
  isRefreshed,
}) => {
  const rotateBeforeRefreshing = useDerivedValue(() => {
    return isRefreshed.value
      ? 360
      : interpolate(
          wrapperHeight.value,
          [0, _loadingIndicatorDiameter],
          [0, 360],
          Extrapolation.CLAMP
        );
  });

  const scaleBeforeRefreshing = useDerivedValue(() => {
    return isRefreshed.value
      ? 1
      : interpolate(
          wrapperHeight.value,
          [0, _loadingIndicatorDiameter],
          [0.2, 1],
          Extrapolation.CLAMP
        );
  });

  const rInnerContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        wrapperHeight.value,
        [0, _loadingIndicatorDiameter],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        { scale: scaleBeforeRefreshing.value },
        { rotate: `-${rotateBeforeRefreshing.value}deg` },
      ],
    };
  });

  // I need to make here listOffsetYOnEndDrag.value - _onRefreshingContainerHeight / 2 - _loadingIndicatorDiameter / 2
  // but before I need to chnage logic from listOffsetYOnEndDrag.value === 0 to isRefreshed
  const translateYOnRefreshing = useDerivedValue(() => {
    return refreshing.value ? withTiming(45, { duration: 500 }) : withTiming(0);
  });

  const rotateOnRefreshing = useDerivedValue(() => {
    console.log("🔴 🔴", refreshing.value); // VS remove
    return refreshing.value
      ? withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false)
      : 0;
  });

  const scaleOnRefreshing = useDerivedValue(() => {
    return isRefreshed.value
      ? interpolate(wrapperHeight.value, [150, 0], [1, 0], Extrapolation.CLAMP)
      : 1;
  });

  const rOuterContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateYOnRefreshing.value },
        { rotate: `${rotateOnRefreshing.value}deg` },
        { scale: scaleOnRefreshing.value },
      ],
    };
  });

  return (
    <Animated.View style={rOuterContainerStyle}>
      <Animated.View
        className="items-center justify-center rounded-full bg-neutral-700 gap-[5px]"
        style={[
          rInnerContainerStyle,
          {
            width: _loadingIndicatorDiameter,
            height: _loadingIndicatorDiameter,
          },
        ]}
      >
        <View className="flex-row gap-[5px]">
          <View className={className.dot} />
          <View className={className.dot} />
        </View>
        <View className="flex-row gap-[5px]">
          <View className={className.dot} />
          <View className={className.dot} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};
