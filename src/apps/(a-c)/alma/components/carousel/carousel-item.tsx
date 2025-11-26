import { FC, memo } from "react";
import { Text, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

type Props = {
  index: number;
  itemWidth: number;
  itemHeight: number;
  slide: any;
  animatedIndex: SharedValue<number>;
};

const CarouselItemComponent: FC<Props> = ({
  slide,
  index,
  animatedIndex,
  itemWidth,
  itemHeight,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Circle parameters: center at bottom center, radius from bottom to card center
  const circleCenterX = screenWidth / 2;
  const circleCenterY = screenHeight;
  const radius = screenHeight / 2;

  const rContainerStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const translateX = interpolate(animatedIndex.get(), inputRange, [
      -itemWidth * 0.3,
      0,
      itemWidth * 0.3,
    ]);
    const translateY = interpolate(animatedIndex.get(), inputRange, [
      itemHeight * 0.15,
      0,
      itemHeight * 0.15,
    ]);

    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <Animated.View
      className="items-center justify-center bg-blue-200 border border-red-500"
      style={[rContainerStyle, { width: itemWidth, height: itemHeight }]}
    >
      <Animated.View
        className="w-[80%] aspect-[1/0.7] rounded-[36px] px-4 bg-white items-center justify-center"
        style={[styles.borderCurve, { width: screenWidth * 0.6 }]}
      >
        <Text className="text-4xl mb-2">{index}</Text>
        <Text className="text-4xl mb-2">{slide.emoji}</Text>
        <Text className="text-3xl font-medium text-center">{slide.description}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export const CarouselItem = memo(CarouselItemComponent);

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
