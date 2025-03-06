import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type ScrollDirection = "to-top" | "to-bottom" | "idle";
export type ScrollDirectionValue = SharedValue<ScrollDirection>;

type Props = {
  topThreshold?: number;
};

/**
 * Returns scroll direction based on relative y position. It means that the direction
 * is calculated based on the y position of the scroll when the user begins to drag.
 */

export const useRelativeScrollDirection = ({ topThreshold }: Props = {}) => {
  const scrollDirection = useSharedValue<ScrollDirection>("idle");
  const scrollDirectionRefY = useSharedValue(0);

  // Place it inside the list animated scroll handler onBeginDrag
  const onBeginDrag = (e: ReanimatedScrollEvent) => {
    "worklet";
    scrollDirectionRefY.value = e.contentOffset.y;
  };

  // Place it inside the list animated scroll handler onScroll
  const onScroll = (e: ReanimatedScrollEvent) => {
    "worklet";

    const offsetY = e.contentOffset.y;

    if (offsetY <= 0) {
      scrollDirection.value = "to-top";
    }
    if (offsetY > scrollDirectionRefY.value) {
      scrollDirection.value = "to-bottom";
    }
    if (offsetY < scrollDirectionRefY.value - (topThreshold ?? 0)) {
      scrollDirection.value = "to-top";
    }
  };

  return {
    scrollDirection,
    scrollDirectionRefY,
    onBeginDrag,
    onScroll,
  };
};
