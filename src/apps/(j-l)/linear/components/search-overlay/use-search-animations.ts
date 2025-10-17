import { useWindowDimensions } from "react-native";
import { useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useSearch } from "../../lib/providers/search-provider";
import { SECTION_HEADER_HEIGHT, SECTION_HEADER_MARGIN_TOP, ITEM_HEIGHT } from "./constants";

export const useSearchAnimations = () => {
  const { height } = useWindowDimensions();
  const translateYDistance = height * 0.07;
  const { transitionProgress } = useSearch();

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

  const rContainerStyle = useAnimatedStyle(() => {
    const rawSearchProgress = transitionProgress.get();
    const easedValue = 1 - (1 - rawSearchProgress) * (1 - rawSearchProgress);
    const translateY = translateYDistance * (1 - easedValue);
    const scale = 0.96 + 0.04 * easedValue;
    const opacity = easedValue;

    return {
      transform: [{ translateY }, { scale }],
      opacity,
      pointerEvents: rawSearchProgress === 1 ? "auto" : "none",
    };
  });

  return {
    scrollY,
    overscrollExceeded,
    appearProgress,
    rChevronContainerStyle,
    rContainerStyle,
  };
};
