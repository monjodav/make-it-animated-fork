import { FC, RefObject, useCallback, useRef, useState } from "react";
import { useHits } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import SearchInput from "./search-input";
import {
  View,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import Switcher from "./switcher";
import Filters from "./filters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUp } from "lucide-react-native";
import { FilterType, useAnimationsStore } from "../../lib/store/animations";
import BottomSheet from "@gorhom/bottom-sheet";
import { Animation } from "../../lib/types/app";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import LogoWithText from "@/assets/images/misc/logo-with-text.png";
import { Image } from "expo-image";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ResultsProps = {
  sheetRef: RefObject<BottomSheet | null>;
};

export const Results: FC<ResultsProps> = ({ sheetRef }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleItemIndices, setVisibleItemIndices] = useState<Set<number>>(new Set());

  const { top, bottom } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const { results } = useHits<Animation>();
  const hits = results?.hits ?? [];

  const listRef = useRef<any>(null);

  const selectedFilters = useAnimationsStore((state) => state.selectedFilters);
  const setCurrentFilter = useAnimationsStore((state) => state.setCurrentFilter);
  const removeItem = useAnimationsStore((state) => state.removeItem);
  const clearAll = useAnimationsStore((state) => state.clearAll);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > screenHeight);
  };

  const handleFilterSelect = useCallback(
    (type: FilterType) => {
      setCurrentFilter(type);
    },
    [setCurrentFilter]
  );

  const handleRemoveItem = useCallback(
    (type: FilterType, item: string) => {
      removeItem(type, item);
    },
    [removeItem]
  );

  const handleClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Animation>[] }) => {
      // Extract indices from viewable items and create a Set for efficient lookup
      const indices = new Set<number>(
        viewableItems
          .map((item) => item.index)
          .filter((index): index is number => index !== null && index !== undefined)
      );
      setVisibleItemIndices(indices);
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 500,
  }).current;

  return (
    <View className="h-full bg-background">
      <FlashList
        ref={listRef}
        data={hits?.slice(0, 5) ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <AnimationCard animation={item} index={index} visibleItemIndices={visibleItemIndices} />
        )}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
      />

      {showBackToTop && (
        <AnimatedPressable
          entering={FadeInDown.springify()}
          exiting={FadeOutDown.springify()}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          className="absolute w-[44px] h-[44px] right-7 bg-muted-foreground rounded-full items-center justify-center shadow-[0_4_8_#1C1C1C80] elevation-8"
          style={{ bottom: bottom + 8 }}
        >
          <ArrowUp size={20} color="#FFFFF5" />
        </AnimatedPressable>
      )}
    </View>
  );
};
