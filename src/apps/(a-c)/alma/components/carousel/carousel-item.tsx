import { FC, memo } from "react";
import { Text, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 40,
  stiffness: 240,
  mass: 3,
};

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
  const rContainerStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const translateX = interpolate(animatedIndex.get(), inputRange, [
      -itemWidth * 0.3,
      0,
      itemWidth * 0.3,
    ]);
    const translateY = interpolate(animatedIndex.get(), inputRange, [
      itemHeight * 0.3,
      0,
      itemHeight * 0.3,
    ]);
    const scale = interpolate(animatedIndex.get(), inputRange, [0.9, 1, 0.9]);

    const rotate = interpolate(animatedIndex.get(), inputRange, [45, 0, -45]);

    return {
      transform: [{ translateX }, { translateY }, { scale }, { rotate: `${rotate}deg` }],
    };
  });

  const isCurrent = useDerivedValue(() => {
    const animatedIdx = animatedIndex.get();
    return index > animatedIdx - 0.1 && index < animatedIdx + 0.5;
  });

  const rBackgroundElementContainerStyle = useAnimatedStyle(() => {
    const targetValue = isCurrent.get() ? 1 : 0;

    return {
      opacity: withSpring(targetValue, SPRING_CONFIG),
      transform: [{ scale: withSpring(targetValue, SPRING_CONFIG) }],
    };
  });

  return (
    <Animated.View
      className="items-center justify-center"
      style={[{ width: itemWidth, height: itemHeight }, rContainerStyle]}
    >
      <Animated.View className="w-[60%] aspect-[1/0.7]" style={styles.borderCurve}>
        <Animated.View
          className="absolute inset-0 justify-center items-center"
          style={rBackgroundElementContainerStyle}
        >
          {slide.backgroundElement}
        </Animated.View>
        <View className="flex-1 rounded-[36px] px-4 bg-white items-center justify-center shadow-lg shadow-black/5">
          <Text className="text-4xl mb-2">{slide.emoji}</Text>
          <Text className="text-3xl font-medium text-center">{slide.description}</Text>
        </View>
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
