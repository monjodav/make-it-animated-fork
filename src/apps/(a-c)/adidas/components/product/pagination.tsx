import { View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import type { ProductItem } from "../../lib/data/product-items";

// adidas-product-infinite-carousel-animation 🔽

const DASH_HEIGHT = 1;
const DASH_SPACING = 20;

type PaginationProps = {
  productItems: ProductItem[];
  currentSlideIndex: SharedValue<number>;
};

const Pagination = ({ productItems, currentSlideIndex }: PaginationProps) => {
  const translateY = useDerivedValue(() => {
    return withSpring(currentSlideIndex.get() * (DASH_HEIGHT + DASH_SPACING));
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.get() }],
    };
  });

  return (
    <View className="absolute right-3 self-center top-1/2 -translate-y-1/2">
      {productItems.map((_, index) => (
        <View
          className="w-1.5 bg-black"
          key={index}
          style={{ height: DASH_HEIGHT, marginVertical: DASH_SPACING / 2 }}
        />
      ))}
      <Animated.View
        className="absolute w-1.5 bg-black"
        style={[animatedIndicatorStyle, { height: DASH_SPACING }]}
      />
    </View>
  );
};

export default Pagination;

// adidas-product-infinite-carousel-animation 🔼
