import { StyleSheet, Text } from "react-native";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import FilterItem from "@/src/shared/components/animations-screen/filters/filter-item";
import { useAnimationsStore, filterData } from "@/src/shared/lib/store/animations";

export default function Animations() {
  const sheetRef = useRef<BottomSheet>(null);

  const currentFilter = useAnimationsStore((state) => state.currentFilter);
  const selectedFilters = useAnimationsStore((state) => state.selectedFilters);
  const toggleItem = useAnimationsStore((state) => state.toggleItem);

  const data = useMemo(() => filterData[currentFilter], [currentFilter]);

  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const handleItemToggle = useCallback(
    (item: string) => {
      toggleItem(item);
    },
    [toggleItem]
  );

  const renderItem = useCallback(
    (item: string) => {
      const isSelected = selectedFilters[currentFilter].includes(item);
      return (
        <FilterItem
          key={item}
          label={item}
          isSelected={isSelected}
          onPress={() => handleItemToggle(item)}
        />
      );
    },
    [currentFilter, selectedFilters, handleItemToggle]
  );

  return (
    <AlgoliaProvider>
      <Results sheetRef={sheetRef} />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={() => {}}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#1C1C1C" }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <Text className="text-[#a8a29e] text-2xl font-semibold mb-4 capitalize px-3">
            {currentFilter}
          </Text>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </AlgoliaProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#1C1C1C",
    paddingBottom: 20,
  },
});
