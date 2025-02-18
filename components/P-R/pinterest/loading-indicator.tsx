import { sharedConfigs } from "@/constants/pinterest/pull-to-refresh-animation";
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
  withSpring,
  withTiming,
} from "react-native-reanimated";

// pinterest-pull-to-refresh-loading-animation 🔽

const className = {
  dot: "w-[5px] h-[5px] rounded-full bg-black",
};

export type LoadingIndicatorProps = {
  wrapperHeight: SharedValue<number>;
  refreshing: SharedValue<boolean>;
  isRefreshed: SharedValue<boolean>;
};

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  wrapperHeight,
  refreshing,
  isRefreshed,
}) => {
  const rotateWithoutRefreshing = useDerivedValue(() => {
    return isRefreshed.value
      ? 360
      : interpolate(
          wrapperHeight.value,
          [0, sharedConfigs.loadingIndicatorDiameter],
          [0, 360],
          Extrapolation.CLAMP
        );
  });

  const scaleWithoutRefreshing = useDerivedValue(() => {
    return isRefreshed.value
      ? 1
      : interpolate(
          wrapperHeight.value,
          [0, sharedConfigs.loadingIndicatorDiameter],
          [0, 1],
          Extrapolation.CLAMP
        );
  });

  const rInnerContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        wrapperHeight.value,
        [0, sharedConfigs.loadingIndicatorDiameter],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        { scale: scaleWithoutRefreshing.value },
        { rotate: `-${rotateWithoutRefreshing.value}deg` },
      ],
    };
  });

  const translateYOnRefreshing = useDerivedValue(() => {
    const maxTranslateDistance =
      sharedConfigs.wrapperHeightOnRefreshing -
      sharedConfigs.wrapperHeightOnRefreshing / 2 -
      sharedConfigs.loadingIndicatorDiameter / 2 -
      12;

    return refreshing.value
      ? withSpring(maxTranslateDistance, sharedConfigs.onRefreshingSpringConfigs)
      : withTiming(0);
  });

  const rotateOnRefreshing = useDerivedValue(() => {
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
            width: sharedConfigs.loadingIndicatorDiameter,
            height: sharedConfigs.loadingIndicatorDiameter,
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

// pinterest-pull-to-refresh-loading-animation 🔼
