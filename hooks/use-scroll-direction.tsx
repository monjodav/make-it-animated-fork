import { useSharedValue, withTiming } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type ScrollDirection = "up" | "down";

export const useScrollDirection = () => {
  const scrollDirection = useSharedValue<ScrollDirection>("down");
  const scrollDirectionRefY = useSharedValue(0);

  const handleScrollDirectionOnScroll = (e: ReanimatedScrollEvent) => {
    "worklet";

    const offsetY = e.contentOffset.y;

    scrollDirectionRefY.value = withTiming(offsetY, { duration: 1 });

    if (offsetY > 0 && offsetY - 2 > scrollDirectionRefY.value && scrollDirection.value === "up") {
      scrollDirection.value = "down";
    }
    if (
      offsetY > 0 &&
      offsetY + 2 < scrollDirectionRefY.value &&
      scrollDirection.value === "down"
    ) {
      scrollDirection.value = "up";
    }
  };

  return {
    scrollDirection,
    handleScrollDirectionOnScroll,
  };
};
