import { StyleSheet, Text } from "react-native";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import FilterItem from "@/src/shared/components/animations-screen/filters/filter-item";

type FilterType = "apps" | "technologies" | "components" | "difficulty";

const filterData: Record<FilterType, string[]> = {
  apps: [
    "adidas",
    "alma",
    "appleBooks",
    "appleInvites",
    "appStore",
    "canva",
    "chatgpt",
    "colorsApp",
    "discord",
    "fuse",
    "github",
    "googleChrome",
    "gmail",
    "grok",
    "instagram",
    "linear",
    "linkedin",
    "longevity",
    "luma",
    "opal",
    "perplexity",
    "pinterest",
    "queue",
    "raycast",
    "shopify",
    "slack",
    "showcase",
    "superlist",
    "threads",
    "viber",
    "whatsapp",
    "x",
  ],
  technologies: [
    "@gorhom/bottom-sheet",
    "Expo",
    "Expo Blur",
    "Expo Image",
    "Expo Linear Gradient",
    "Expo Router",
    "React Native",
    "React Native Animated",
    "React Native Coolpsable Tab View",
    "React Native Gesture Handler",
    "React Native Keyboard Controller",
    "React Native Masked View",
    "React Native Reanimated",
    "React Native Redash",
    "React Native Skia",
    "React Native Svg",
    "React Native Theme Switch Animation",
    "Reanimated Color Picker",
  ],
  components: [
    "Activity Indicator",
    "Background",
    "Badge",
    "Blur",
    "Bottomm Navigation",
    "Bottom Sheet",
    "Bottom Tabs",
    "Button",
    "Button Group",
    "Card",
    "Calousel",
    "Chip",
    "Color Picker",
    "Flashlist",
    "Flatlist",
    "Floating Action Button",
    "Gradient",
    "Header",
    "Icon",
    "Image",
    "Keyboard",
    "Keyboard Avoiding View",
    "List",
    "List Item",
    "Loading Indicator",
    "Marquee",
    "Masonry List",
    "Menu",
    "Modal",
    "Overlay",
    "Pagination",
    "Pressable",
    "Radio Button",
    "Refresh Control",
    "Scroll View",
    "Search Bar",
    "Segmented Buttons",
    "Slider",
    "Stepper",
    "Switch",
    "Tab Bar",
    "Tab Indicator",
    "Tab View",
    "Text",
    "Text Input",
    "Title",
    "Toggle Button",
    "Top Tabs",
    "View",
  ],
  difficulty: ["Easy", "Medium", "Hard"],
};

type SelectedFilters = Record<FilterType, string[]>;

export default function Animations() {
  const sheetRef = useRef<BottomSheet>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("apps");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    apps: [],
    technologies: [],
    components: [],
    difficulty: [],
  });

  const data = useMemo(() => filterData[currentFilter], [currentFilter]);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleFilterSelect = useCallback((type: FilterType) => {
    setCurrentFilter(type);
  }, []);

  const handleItemToggle = useCallback(
    (item: string) => {
      setSelectedFilters((prev) => {
        const currentItems = prev[currentFilter];
        const isSelected = currentItems.includes(item);

        return {
          ...prev,
          [currentFilter]: isSelected
            ? currentItems.filter((i) => i !== item)
            : [...currentItems, item],
        };
      });
    },
    [currentFilter]
  );

  const handleRemoveItem = useCallback((type: FilterType, item: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((i) => i !== item),
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedFilters({
      apps: [],
      technologies: [],
      components: [],
      difficulty: [],
    });
  }, []);

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
      <Results
        sheetRef={sheetRef}
        handleFilterSelect={handleFilterSelect}
        selectedFilters={selectedFilters}
        handleRemoveItem={handleRemoveItem}
        handleClearAll={handleClearAll}
      />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
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
