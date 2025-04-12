import React, { FC } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";

const _containerDefaultDotColor = colorKit.setAlpha("#fff", 0.2).hex();
const _containerActiveDotColor = "#fff";

type DotProps = {
  index: number;
  currentIndex: number;
};

const Dot = ({ index, currentIndex }: DotProps) => {
  const rDotStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        currentIndex === index ? _containerActiveDotColor : _containerDefaultDotColor,
        {
          duration: 150,
        }
      ),
    };
  });
  return <Animated.View key={index} className="h-2.5 w-2.5 rounded-full" style={rDotStyle} />;
};

type Props = {
  currentIndex: number;
  total: number;
};

export const AchievementPagination: FC<Props> = ({ currentIndex, total }) => {
  if (total < 2) {
    return <></>;
  }

  return (
    <View className="items-center p-7">
      <View className="flex-row items-center gap-2.5">
        {Array.from({ length: total }).map((_, index) => (
          <Dot key={index} index={index} currentIndex={currentIndex} />
        ))}
      </View>
    </View>
  );
};
