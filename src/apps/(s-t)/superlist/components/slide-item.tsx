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
      className="p-7"
      style={[{ width, borderCurve: "continuous" }, rStyle]}
      onLayout={(e) => {
        setItemHeight(e.nativeEvent.layout.height);
      }}
    >
      <View
        className="flex-1 items-center justify-center rounded-3xl"
        style={{ backgroundColor: item.bgColor }}
      >
        <Text className="text-white">Slide {index}</Text>
      </View>
    </Animated.View>
  );
};
