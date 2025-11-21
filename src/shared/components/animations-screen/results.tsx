import { FC, RefObject, useCallback, useRef, useState } from "react";
import { useHits } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import { LegendList } from "@legendapp/list";
import SearchInput from "./search-input";
import { View, Pressable, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import Switcher from "./switcher";
import Filters from "./filters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUp } from "lucide-react-native";
import { FilterType, useAnimationsStore } from "../../lib/store/animations";
import BottomSheet from "@gorhom/bottom-sheet";
import { Animation } from "../../lib/types/app";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type ResultsProps = {
  sheetRef: RefObject<BottomSheet | null>;
};

export const Results: FC<ResultsProps> = ({ sheetRef }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { results } = useHits<Animation>();
  const hits = results?.hits ?? [];
  const listRef = useRef<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const selectedFilters = useAnimationsStore((state) => state.selectedFilters);
  const setCurrentFilter = useAnimationsStore((state) => state.setCurrentFilter);
  const removeItem = useAnimationsStore((state) => state.removeItem);
  const clearAll = useAnimationsStore((state) => state.clearAll);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > SCREEN_HEIGHT * 1.5);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
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

  return (
    <View className="flex-1 bg-background">
      <LegendList
        ref={listRef}
        data={hits?.slice(0, 2) ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AnimationCard animation={item} />}
        ListHeaderComponent={() => {
          return (
            <View>
              <SearchInput />
              <View className="h-6" />
              <Filters
                sheetRef={sheetRef}
                onFilterSelect={handleFilterSelect}
                selectedFilters={selectedFilters}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
              />
              <Switcher />
            </View>
          );
        }}
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingTop: top + 12 }}
        showsVerticalScrollIndicator={false}
        // recycleItems
        // maintainVisibleContentPosition
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {showBackToTop && (
        <Pressable
          onPress={scrollToTop}
          className="absolute w-[50px] h-[50px] right-3 bg-white rounded-full items-center justify-center shadow-[0_4_8_#1C1C1C80] elevation-8"
          style={{ bottom }}
        >
          <ArrowUp size={24} color="#000" strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
};
