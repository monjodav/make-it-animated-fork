import {
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
  SharedValue,
  DerivedValue,
} from "react-native-reanimated";
import { useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { useHapticOnScroll } from "@/src/shared/lib/hooks/use-haptic-on-scroll";
import { TRIGGER_THRESHOLD, MORPH_DISTANCE } from "./constants";
import { scheduleOnRN } from "react-native-worklets";
import { use } from "react";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";

export const useScrollHandlers = (
  scrollY: SharedValue<number>,
  overscrollExceeded: SharedValue<boolean>,
  appearProgress: DerivedValue<number>
) => {
  const { onCloseSearchModal } = use(SearchTransitionContext);

  const { onScroll: scrollDirectionOnScroll, scrollDirection } =
    useScrollDirection("include-negative");

  const isListDragging = useSharedValue(false);

  const { singleHapticOnScroll } = useHapticOnScroll({
    isListDragging,
    scrollDirection,
    triggerOffset: -TRIGGER_THRESHOLD,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      overscrollExceeded.set(false);
      isListDragging.set(true);
    },
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.set(offsetY);
      overscrollExceeded.set(offsetY <= -TRIGGER_THRESHOLD);

      scrollDirectionOnScroll(event);
      singleHapticOnScroll(event);
    },
    onEndDrag: () => {
      isListDragging.set(false);
      if (overscrollExceeded.get()) {
        overscrollExceeded.set(false);
        scheduleOnRN(onCloseSearchModal);
      }
    },
  });

  const overscrollMorph = useDerivedValue(() => {
    const overscroll = Math.max(-scrollY.get(), 0);
    return Math.min(overscroll / MORPH_DISTANCE, 1);
  });

  const morphProgress = useDerivedValue(() => {
    const entranceMorph = 1 - appearProgress.get();
    const blended = Math.max(overscrollMorph.get(), 0);

    const p = Math.max(blended, entranceMorph);
    return Math.min(Math.max(p, 0), 1);
  });

  return {
    scrollHandler,
    morphProgress,
  };
};
