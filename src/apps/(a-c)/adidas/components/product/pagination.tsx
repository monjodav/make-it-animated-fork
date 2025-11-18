import { FC } from "react";
import { View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { ProductItem } from "../../lib/data/data";

type PaginationProps = {
  initialData: ProductItem[];
  currentSlideIndex: SharedValue<number>;
};

const DASH_HEIGHT = 1;
const DASH_SPACING = 20;

const Pagination: FC<PaginationProps> = ({ initialData, currentSlideIndex }) => {
  const rIndicatorStyle = useAnimatedStyle(() => {
    const translateY = withSpring(currentSlideIndex.get() * (DASH_HEIGHT + DASH_SPACING));

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View className="absolute right-3 self-center top-1/2 -translate-y-1/2">
      {initialData.map((_, index) => (
        <View
          className="w-[4px] bg-black"
          key={index}
          style={{ height: DASH_HEIGHT, marginVertical: DASH_SPACING / 2 }}
        />
      ))}
      <Animated.View
        className=" absolute w-[4px] bg-black"
        style={[rIndicatorStyle, { height: DASH_SPACING }]}
      />
    </View>
  );
};

export default Pagination;
