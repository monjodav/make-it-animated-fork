import { SectionList, View, useWindowDimensions } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  sections,
  renderSectionHeader,
  renderListItem,
} from "../components/search-overlay/mock-data";
import { ChevronIndicator } from "../components/search-overlay/chevron-indicator";
import { SearchInput } from "../components/search-overlay/search-input";
import { useSearchAnimations } from "../components/search-overlay/use-search-animations";
import { useScrollHandlers } from "../components/search-overlay/use-scroll-handlers";

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList as any
) as unknown as typeof SectionList;

export const SearchModal = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const { scrollY, overscrollExceeded, appearProgress, rChevronContainerStyle } =
    useSearchAnimations();

  const { scrollHandler, morphProgress } = useScrollHandlers(
    scrollY,
    overscrollExceeded,
    appearProgress
  );

  return (
    <View className="bg-linear-back" style={{ paddingTop: insets.top }}>
      <AnimatedSectionList
        sections={sections}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderListItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={() => (
          <ChevronIndicator
            morphProgress={morphProgress}
            chevronContainerStyle={rChevronContainerStyle}
          />
        )}
        SectionSeparatorComponent={() => <View className="h-6" />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingBottom: height * 0.5,
        }}
      />
      <SearchInput />
    </View>
  );
};
