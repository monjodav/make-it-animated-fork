import { Text, Platform, Pressable, FlatList, useWindowDimensions, View } from "react-native";
import Reanimated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  scrollTo,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { useMeasureFlatListTabsLayout } from "@/src/shared/lib/hooks/use-measure-flat-list-tabs-layout";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { TabName } from "react-native-collapsible-tab-view/lib/typescript/src/types";

// pinterest-navigation-between-boards-animation 🔽

const TAB_BAR_HORIZONTAL_PADDING = 16;
const TAB_BAR_GAP = 16;

type Props = TabBarProps<TabName>;

export function TabBar({
  containerRef,
  focusedTab,
  index,
  indexDecimal,
  onTabPress,
  tabNames,
  tabProps,
  width,
}: Props) {
  const { width: tabWidth } = useWindowDimensions();

  const listAnimatedRef = useAnimatedRef<FlatList>();

  const tabBarOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffsetX.value = event.contentOffset.x;
    },
  });

  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: tabNames.length,
    sidePadding: TAB_BAR_HORIZONTAL_PADDING,
    gap: TAB_BAR_GAP,
  });

  /*---------------------------------------------*
   * Here keep tab bar scroll in sync with tabs
   *---------------------------------------------*/

  useDerivedValue(() => {
    const tabsCenter = tabNames.map(
      (_, index) => tabOffsets.value[index] + tabWidths.value[index] / 2
    );

    const firstTabIndexCanBeCentered = tabNames.findIndex(
      (_, index) => tabsCenter[index] > tabWidth / 2
    );

    const outputRange = tabsCenter.map((center, index) => {
      if (index < firstTabIndexCanBeCentered) {
        return 0;
      }
      return center - tabWidth / 2;
    });

    const offsetX = interpolate(indexDecimal.value, Object.keys(tabNames).map(Number), outputRange);

    scrollTo(listAnimatedRef, offsetX, 0, false);
  });

  /*---------------------------------------------*
   * Here we have render fn for tab bar item
   *---------------------------------------------*/
  const _renderItem = ({ item, index }: { item: TabName; index: number }) => {
    const onPress = () => {
      onTabPress(item);
    };

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
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          tabWidths.modify((value) => {
            "worklet";
            value[index] = width;
            return value;
          });
        }}
      >
        <Text className="text-neutral-300 text-lg font-medium">{item}</Text>
      </Pressable>
    );
  };

  /*---------------------------------------------*
   * And finally we have tab bar
   *---------------------------------------------*/
  return (
    <View className="pb-2 bg-neutral-950">
      <Reanimated.FlatList
        ref={listAnimatedRef}
        data={tabNames}
        keyExtractor={(item) => item}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
          gap: TAB_BAR_GAP,
        }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <TabIndicator
        activeTabIndex={indexDecimal}
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        tabBarOffsetX={tabBarOffsetX}
      />
    </View>
  );
}

// pinterest-navigation-between-boards-animation 🔼
