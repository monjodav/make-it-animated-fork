import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type ScrollDirection = "to-top" | "to-bottom" | "idle";
export type ScrollDirectionValue = SharedValue<ScrollDirection>;

/**
 * "Absolute" in this context means that the scroll direction changes on user drag gesture,
 * rather than being relative to previous scroll position.
 */
export const useAbsoluteScrollDirection = () => {
  const scrollDirection = useSharedValue<ScrollDirection>("idle");
  const scrollDirectionRefY = useSharedValue(0);

  // Place it inside the list animated scroll handler onScroll
  const onScroll = (e: ReanimatedScrollEvent) => {
    "worklet";

    const offsetY = e.contentOffset.y;

    const positiveOffsetY = Math.max(offsetY, 0);
    const positivePrevOffsetY = Math.max(scrollDirectionRefY.value, 0);

    if (
      positivePrevOffsetY - positiveOffsetY < 0 &&
      (scrollDirection.value === "idle" || scrollDirection.value === "to-top")
    ) {
      scrollDirection.value = "to-bottom";
    }
    if (
      positivePrevOffsetY - positiveOffsetY >= 0 &&
      (scrollDirection.value === "idle" || scrollDirection.value === "to-bottom")
    ) {
      scrollDirection.value = "to-top";
    }

    scrollDirectionRefY.value = offsetY;
  };

  return {
    scrollDirection,
    onScroll,
  };
};
