import { SectionList, View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
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
import { WithPullToRefresh } from "@/src/shared/components/with-pull-to-refresh";

// linear-search-screen-open-close-animation 🔽

const TRIGGER_THRESHOLD = 200;

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList as any
) as unknown as typeof SectionList;

export const SearchModal = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const { transitionProgress, onCloseSearchModal } = use(SearchTransitionContext);

  const isListDragging = useSharedValue(false);

  const { onScroll: scrollDirectionOnScroll, scrollDirection } =
    useScrollDirection("include-negative");

  const { singleHapticOnScroll } = useHapticOnScroll({
    isListDragging,
    scrollDirection,
    triggerOffset: -TRIGGER_THRESHOLD,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => isListDragging.set(true),
    onScroll: (event) => {
      scrollDirectionOnScroll(event);
      singleHapticOnScroll(event);
    },
    onEndDrag: () => isListDragging.set(false),
  });

  const rListContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transitionProgress.get(), [1, 1.5], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(transitionProgress.get(), [1, 1.5], [0, 20], Extrapolation.CLAMP),
        },
        {
          scale: interpolate(transitionProgress.get(), [1, 1.5], [1, 0.9], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View
      className="flex-1 bg-linear-back"
      style={[{ paddingTop: insets.top }, rListContainerStyle]}
    >
      <WithPullToRefresh
        refreshThreshold={TRIGGER_THRESHOLD}
        refreshing={false}
        onRefresh={onCloseSearchModal}
        refreshComponent={<ChevronIndicator />}
        lockRefreshViewOnRelease
        refreshComponentContainerClassName="mb-6"
      >
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
      </WithPullToRefresh>
      <SearchInput />
    </Animated.View>
  );
};

// linear-search-screen-open-close-animation 🔼
