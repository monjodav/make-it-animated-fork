import { SectionList, View, useWindowDimensions } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  sections,
  renderSectionHeader,
  renderListItem,
} from "../components/search-overlay/mock-data";
import { ChevronIndicator } from "../components/search-overlay/chevron-indicator";
import { SearchInput } from "../components/search-overlay/search-input";
import { use } from "react";
import { SearchTransitionContext } from "@/app/(apps)/(j-l)/linear/_layout";
import { WithPullToRefresh } from "@/src/shared/components/with-pull-to-refresh";

// linear-search-screen-open-close-animation 🔽

// Pull-to-dismiss threshold (why): distance to trigger close/haptic on downward drag
const TRIGGER_THRESHOLD = 200;

// createAnimatedComponent (why): Animated SectionList needed for Reanimated scroll events
const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList as any
) as unknown as typeof SectionList;

export const SearchModal = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const { transitionProgress, onCloseSearchModal } = use(SearchTransitionContext);

  const rListContainerStyle = useAnimatedStyle(() => {
    // Fade/scale the list during close only (1→1.5). Keep visible otherwise.
    // Opacity: 1 → 0. Transform: translateY 0→20px, scale 1→0.9.
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
        // Lock (why): keep indicator pinned until release to avoid jitter around threshold
        lockRefreshViewOnRelease
        refreshComponentContainerClassName="mb-6"
      >
        <AnimatedSectionList
          sections={sections}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderListItem}
          renderSectionHeader={renderSectionHeader}
          SectionSeparatorComponent={() => <View className="h-6" />}
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
