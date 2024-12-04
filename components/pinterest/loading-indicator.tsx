import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

export const _loadingIndicatorDiameter = 44;

const className = {
  dot: "w-[5px] h-[5px] rounded-full bg-black",
};

type Props = {
  offsetY: SharedValue<number>;
};

export const LoadingIndicator: FC<Props> = ({ offsetY }) => {
  const rotate = useDerivedValue(() => {
    return interpolate(
      offsetY.value,
      [0, -_loadingIndicatorDiameter],
      [0, 360],
      Extrapolation.CLAMP
    );
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offsetY.value, [0, -_loadingIndicatorDiameter], [0, 1]),
      transform: [
        {
          translateY: interpolate(
            offsetY.value,
            [0, -_loadingIndicatorDiameter],
            [0, _loadingIndicatorDiameter / 4]
          ),
        },
        {
          scale: interpolate(
            offsetY.value,
            [0, -_loadingIndicatorDiameter],
            [0.2, 1],
            Extrapolation.CLAMP
          ),
        },
        { rotate: `-${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute self-center items-center justify-center rounded-full bg-neutral-700 gap-[5px]"
      style={[
        rContainerStyle,
        {
          width: _loadingIndicatorDiameter,
          height: _loadingIndicatorDiameter,
          top: -_loadingIndicatorDiameter / 2,
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
  );
};
