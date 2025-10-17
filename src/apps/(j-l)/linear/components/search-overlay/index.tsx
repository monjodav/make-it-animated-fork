import { SectionList, View, useWindowDimensions } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearch } from "../../lib/providers/search-provider";
import { sections, renderSectionHeader, renderListItem } from "./mock-data";
import { ChevronIndicator } from "./chevron-indicator";
import { SearchInput } from "./search-input";
import { useSearchAnimations } from "./use-search-animations";
import { useScrollHandlers } from "./use-scroll-handlers";

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList as any
) as unknown as typeof SectionList;

export const SearchOverlay = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { closeSearch } = useSearch();

  const {
    inputRef,
    blur,
    scrollY,
    overscrollExceeded,
    appearProgress,
    rChevronContainerStyle,
    rContainerStyle,
  } = useSearchAnimations();

  const { scrollHandler, morphProgress } = useScrollHandlers(
    scrollY,
    overscrollExceeded,
    appearProgress,
    blur
  );

  const handleClose = () => {
    inputRef.current?.blur();
    closeSearch();
  };

  return (
    <View className="absolute inset-0" style={{ top: insets.top }}>
      <Animated.View style={rContainerStyle}>
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
        <SearchInput ref={inputRef} onClose={handleClose} />
      </Animated.View>
    </View>
  );
};
