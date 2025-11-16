import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FC, useState } from "react";
import { OnboardingSlide } from "./lib/types";

type SlideItemProps = {
  item: OnboardingSlide;
  index: number;
  width: number;
  scrollOffsetX: SharedValue<number>;
};

export const SlideItem: FC<SlideItemProps> = ({ item, index, width, scrollOffsetX }) => {
  const [itemHeight, setItemHeight] = useState(320);

  const rStyle = useAnimatedStyle(() => {
    const inputRange = [width * index, width * (index + 1)];
    const rotate = interpolate(scrollOffsetX.get(), inputRange, [0, -3], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX: width / 2 },
        { translateY: itemHeight / 2 },
        { rotate: `${rotate}deg` },
        { translateX: -width / 2 },
        { translateY: -itemHeight / 2 },
      ],
    };
  }, [scrollOffsetX, index, width]);

  return (
    <Animated.View
      className="px-7 py-5"
      style={[{ width }, rStyle]}
      onLayout={(e) => setItemHeight(e.nativeEvent.layout.height)}
    >
      <View
        className="flex-1 items-center p-20 px-8 rounded-3xl"
        style={{
          backgroundColor: item.bgColor,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
          borderCurve: "continuous",
        }}
      >
        <Text className="text-white text-4xl font-bold text-center mb-20">{item.title}</Text>
        <View className="w-3/4 aspect-[1/1.3] rounded-3xl bg-white/20" />
      </View>
    </Animated.View>
  );
};
