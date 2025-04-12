import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  index: number;
  imageSource: number;
  scrollOffsetX: SharedValue<number>;
};

export const AchievementBadge: FC<Props> = ({ index, imageSource, scrollOffsetX }) => {
  const { width } = useWindowDimensions();

  const rContainerStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const rotate = interpolate(
      scrollOffsetX.value,
      inputRange,
      [360, 0, -360],
      Extrapolation.EXTEND
    );

    return {
      transform: [{ rotateY: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View
      className="aspect-square rounded-full border-[10px] border-white overflow-hidden"
      style={[{ width: width * 0.65 }, rContainerStyle]}
    >
      <Image source={imageSource} style={{ width: "100%", height: "100%" }} contentFit="cover" />
    </Animated.View>
  );
};
