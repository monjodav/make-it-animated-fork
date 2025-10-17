import { useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SECTION_HEADER_HEIGHT, SECTION_HEADER_MARGIN_TOP, ITEM_HEIGHT } from "./constants";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";
import { use } from "react";

export const useSearchAnimations = () => {
  const { transitionProgress } = use(SearchTransitionContext);

  const { height: kbHeight, progress: kbProgress } = useReanimatedKeyboardAnimation();
  const kbTargetHeight = useSharedValue(0);
  const prevKbH = useSharedValue(0);
  const wasKeyboardVisible = useSharedValue(false);
  const prevProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const overscrollExceeded = useSharedValue(false);

  useDerivedValue(() => {
    const rawKbProgress = kbProgress.get();
    const rawKbHeight = Math.max(-kbHeight.get(), 0);
    if (rawKbProgress === 0) {
      kbTargetHeight.set(0);
    } else if (rawKbHeight > kbTargetHeight.get()) {
      kbTargetHeight.set(rawKbHeight);
    }

    wasKeyboardVisible.set(rawKbHeight > 0);
    prevKbH.set(rawKbHeight);
  });

  const appearProgress = useDerivedValue(() => {
    const rawSearchProgress = transitionProgress.get();
    return 1 - (1 - rawSearchProgress) * (1 - rawSearchProgress);
  });

  useDerivedValue(() => {
    const curr = transitionProgress.get();

    if (curr === 0 && overscrollExceeded.get()) {
      overscrollExceeded.set(false);
    }
    prevProgress.set(curr);
  });

  const rChevronContainerStyle = useAnimatedStyle(() => {
    const rawScrollY = scrollY.get();
    const overscrollShift = rawScrollY < 0 ? rawScrollY / 2 : 0;

    const secondItemY = SECTION_HEADER_HEIGHT + SECTION_HEADER_MARGIN_TOP + ITEM_HEIGHT;
    const entranceOffset = (1 - appearProgress.get()) * secondItemY;

    const translateY = overscrollShift + entranceOffset;
    return { transform: [{ translateY }] };
  });

  return {
    scrollY,
    overscrollExceeded,
    appearProgress,
    rChevronContainerStyle,
  };
};
