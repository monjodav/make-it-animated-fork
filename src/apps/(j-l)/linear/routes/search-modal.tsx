import { SectionList, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  sections,
  renderSectionHeader,
  renderListItem,
} from "../components/search-overlay/mock-data";
import { ChevronIndicator } from "../components/search-overlay/chevron-indicator";
import { SearchInput } from "../components/search-overlay/search-input";
import { useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { use } from "react";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";
import { useHapticOnScroll } from "@/src/shared/lib/hooks/use-haptic-on-scroll";
import { TRIGGER_THRESHOLD } from "../components/search-overlay/constants";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList as any
) as unknown as typeof SectionList;

export const SearchModal = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const { onCloseSearchModal } = use(SearchTransitionContext);

  const scrollY = useSharedValue(0);
  const isListDragging = useSharedValue(false);
  const isTriggerThresholdReached = useSharedValue(false);

  const { onScroll: scrollDirectionOnScroll, scrollDirection } =
    useScrollDirection("include-negative");

  const { singleHapticOnScroll } = useHapticOnScroll({
    isListDragging,
    scrollDirection,
    triggerOffset: -TRIGGER_THRESHOLD,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isListDragging.set(true);
      isTriggerThresholdReached.set(false);
    },
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.set(offsetY);

      scrollDirectionOnScroll(event);
      singleHapticOnScroll(event);
    },
    onEndDrag: () => {
      isListDragging.set(false);
      if (scrollY.get() <= -TRIGGER_THRESHOLD) {
        isTriggerThresholdReached.set(true);
        scheduleOnRN(onCloseSearchModal);
      }
    },
  });

  return (
    <View className="flex-1 bg-linear-back" style={{ paddingTop: insets.top }}>
      <ChevronIndicator scrollY={scrollY} isTriggerThresholdReached={isTriggerThresholdReached} />
      <AnimatedSectionList
        sections={sections}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderListItem}
        renderSectionHeader={renderSectionHeader}
        SectionSeparatorComponent={() => <View className="h-6" />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingTop: 36,
          paddingBottom: height * 0.5,
        }}
      />
      <SearchInput />
    </View>
  );
};
