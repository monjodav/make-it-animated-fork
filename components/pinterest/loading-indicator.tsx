import React, { FC, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const _loadingIndicatorDiameter = 44;

const className = {
  dot: "w-[5px] h-[5px] rounded-full bg-black",
};

type Props = {
  offsetY: SharedValue<number>;
  lastOffsetY: SharedValue<number>;
  refreshing: boolean;
  isRefreshed: boolean;
};

export const LoadingIndicator: FC<Props> = ({ offsetY, lastOffsetY, refreshing, isRefreshed }) => {
  const rotateBeforeRefreshing = useDerivedValue(() => {
    return isRefreshed
      ? 360
      : interpolate(offsetY.value, [0, _loadingIndicatorDiameter], [0, 360], Extrapolation.CLAMP);
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        offsetY.value,
        [0, _loadingIndicatorDiameter],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: isRefreshed
            ? 1
            : interpolate(
                offsetY.value,
                [0, _loadingIndicatorDiameter],
                [0.2, 1],
                Extrapolation.CLAMP
              ),
        },
        { rotate: `-${rotateBeforeRefreshing.value}deg` },
      ],
    };
  });

  const rotateAfterRefreshing = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      rotateAfterRefreshing.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotateAfterRefreshing.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing]);

  const rRotateAfterRefreshingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateAfterRefreshing.value}deg` },
        {
          scale: isRefreshed
            ? interpolate(offsetY.value, [150, 0], [1, 0], Extrapolation.CLAMP)
            : 1,
        },
      ],
    };
  });

  return (
    <Animated.View style={rRotateAfterRefreshingStyle}>
      <Animated.View
        className="items-center justify-center rounded-full bg-neutral-700 gap-[5px]"
        style={[
          rContainerStyle,
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
