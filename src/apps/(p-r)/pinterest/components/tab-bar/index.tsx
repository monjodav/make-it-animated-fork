import { Text, Platform, Pressable, FlatList, useWindowDimensions, View } from "react-native";
import Reanimated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  scrollTo,
  runOnUI,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { useMeasureFlatListTabsLayout } from "@/src/shared/lib/hooks/use-measure-flat-list-tabs-layout";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { TabName } from "react-native-collapsible-tab-view/lib/typescript/src/types";

// pinterest-navigation-between-boards-animation 🔽

// Layout constants for tab bar spacing and indicator calculations
const TAB_BAR_HORIZONTAL_PADDING = 16; // Side padding affects scroll centering calculations
const TAB_BAR_GAP = 24; // Gap between tabs used in offset positioning

type Props = TabBarProps<TabName>;

export function TabBar({ focusedTab, indexDecimal, onTabPress, tabNames }: Props) {
  const { width: tabWidth } = useWindowDimensions();

  // Animated ref enables programmatic scrolling for tab centering
  const listAnimatedRef = useAnimatedRef<FlatList>();

  // Tracks horizontal scroll position for indicator transform compensation
  const tabBarOffsetX = useSharedValue(0);

  // Shared values coordinate smooth tab transitions during user press
  const pressStartIndex = useSharedValue<number>(0); // Starting tab index for interpolation
  const pressEndIndex = useSharedValue<number | null>(null); // Target tab index, null when not transitioning

  // Worklet-optimized scroll handler tracks horizontal offset for indicator positioning
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffsetX.value = event.contentOffset.x; // Syncs with TabIndicator translateX compensation
    },
  });

  // Dynamic measurement system calculates tab positions and widths for responsive indicator
  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabNames.length,
    sidePadding: TAB_BAR_HORIZONTAL_PADDING,
    gap: TAB_BAR_GAP,
  });

  /*---------------------------------------------*
   * Smart tab centering algorithm with smooth interpolation
   * Keeps active tab centered while handling edge cases
   *---------------------------------------------*/

  useDerivedValue(() => {
    "worklet";
    // Calculate center point of each tab for centering calculations
    const tabsCenter = tabNames.map(
      (_, index) => tabOffsets.value[index] + tabWidths.value[index] / 2
    );

    // Find first tab that can be centered (has enough space on left)
    // Tabs before this index stay at scroll position 0
    const firstTabIndexCanBeCentered = tabNames.findIndex(
      (_, index) => tabsCenter[index] > tabWidth / 2
    );

    // Build output range: 0 for edge tabs, center-offset for others
    const outputRange = tabsCenter.map((center, index) => {
      if (index < firstTabIndexCanBeCentered) {
        return 0; // Keep left-edge tabs at start
      }
      return center - tabWidth / 2; // Center tab in viewport
    });

    // Handle user-initiated tab press with smooth transition
    if (pressEndIndex.value !== null) {
      const startIndex = pressStartIndex.value;
      const targetIndex = pressEndIndex.value;
      // Create custom interpolation range for press transition
      const inputRange = [startIndex, targetIndex];
      const output = [outputRange[startIndex], outputRange[targetIndex]];
      const offsetX = interpolate(indexDecimal.value, inputRange, output);
      scrollTo(listAnimatedRef, offsetX, 0, false); // Smooth scroll without animation

      // Reset press state when transition completes
      if (indexDecimal.value === targetIndex) {
        pressEndIndex.value = null;
      }
    } else {
      // Normal scroll synchronization with tab view paging
      const offsetX = interpolate(
        indexDecimal.value, // Input: current tab index (can be fractional during swipe)
        Object.keys(tabNames).map(Number), // Input range: [0, 1, 2, ...]
        outputRange // Output: corresponding scroll positions
      );
      scrollTo(listAnimatedRef, offsetX, 0, false);
    }
  });

  /*---------------------------------------------*
   * Tab item renderer with press handling and layout measurement
   *---------------------------------------------*/
  const _renderItem = ({ item, index }: { item: TabName; index: number }) => {
    const onPress = () => {
      // Update shared values on UI thread for smooth transition coordination
      runOnUI(() => {
        "worklet";
        pressEndIndex.value = index; // Target tab for interpolation
        pressStartIndex.value = indexDecimal.value; // Current position (can be fractional)
      })();
      onTabPress(item); // Trigger external tab change
    };

    // Long press fallback for accessibility
    const onLongPress = () => {
      onTabPress(item);
    };

    return (
      <Pressable
        key={item}
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={focusedTab.value === item ? { selected: true } : {}}
        accessibilityLabel={item}
        onPress={onPress}
        onLongPress={onLongPress}
        className="flex items-center justify-center rounded-full"
        // Critical: Measures actual tab width for precise indicator positioning
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          tabWidths.modify((value) => {
            "worklet"; // Enables UI thread updates for smooth animations
            value[index] = width; // Updates shared array for indicator calculations
            return value;
          });
        }}
      >
        <Text className="text-neutral-300 text-lg font-medium">{item}</Text>
      </Pressable>
    );
  };

  /*---------------------------------------------*
   * Main tab bar layout with coordinated indicator
   *---------------------------------------------*/
  return (
    <View className="pb-2 bg-black">
      {/* Reanimated.FlatList enables worklet-optimized scroll handling */}
      <Reanimated.FlatList
        ref={listAnimatedRef}
        data={tabNames}
        keyExtractor={(item) => item}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING, // Matches centering calculations
          gap: TAB_BAR_GAP, // Consistent with offset calculations
        }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // ~60fps for smooth scroll tracking
      />
      {/* Positioned below tabs for proper layering */}
      <TabIndicator
        activeTabIndex={indexDecimal} // Fractional index drives smooth transitions
        tabWidths={tabWidths} // Dynamic widths for responsive indicator sizing
        tabOffsets={tabOffsets} // Calculated positions for accurate placement
        tabBarOffsetX={tabBarOffsetX} // Scroll compensation for fixed positioning
      />
    </View>
  );
}

// pinterest-navigation-between-boards-animation 🔼
