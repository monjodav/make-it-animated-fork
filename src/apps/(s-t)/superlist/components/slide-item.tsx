import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FC } from "react";
import { OnboardingSlide } from "./lib/types";

// superlist-onboarding-flow-animation 🔽

type SlideItemProps = {
  item: OnboardingSlide;
  index: number;
  width: number;
  scrollOffsetX: SharedValue<number>;
};

export const SlideItem: FC<SlideItemProps> = ({ item, index, width, scrollOffsetX }) => {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [width * (index - 1), width * index, width * (index + 1)];

    const rotate = interpolate(scrollOffsetX.get(), inputRange, [2, 0, -2], Extrapolation.CLAMP);
    const translateY = interpolate(scrollOffsetX.get(), inputRange, [4, 0, 4], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  }, [scrollOffsetX, index, width]);

  return (
    <Animated.View className="px-7 py-5" style={[{ width }, rStyle]}>
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

// superlist-onboarding-flow-animation 🔼
