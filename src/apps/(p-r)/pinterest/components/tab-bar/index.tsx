import { Text, Platform, Pressable, FlatList, Animated, useWindowDimensions } from "react-native";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
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
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { useReanimatedTopTabsIndex } from "@/src/shared/lib/hooks/use-reanimated-top-tabs-index";

// pinterest-navigation-between-boards-animation 🔽

const TAB_BAR_HORIZONTAL_PADDING = 16;
const TAB_BAR_GAP = 16;

type Props = MaterialTopTabBarProps;

export function TabBar({ state, descriptors, navigation, position }: Props) {
  const { width: tabWidth } = useWindowDimensions();

  const listAnimatedRef = useAnimatedRef<FlatList>();

  const tabBarOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffsetX.value = event.contentOffset.x;
    },
  });

  const { tabWidths, tabOffsets } = useMeasureFlatListTabsLayout({
    tabsLength: state.routes.length,
    sidePadding: TAB_BAR_HORIZONTAL_PADDING,
    gap: TAB_BAR_GAP,
  });

  const { activeTabIndex, dummyOpacity } = useReanimatedTopTabsIndex({
    position,
    state,
  });

  /*---------------------------------------------*
   * Here keep tab bar scroll in sync with tabs
   *---------------------------------------------*/
  useDerivedValue(() => {
    const tabsCenter = state.routes.map(
      (_, index) => tabOffsets.value[index] + tabWidths.value[index] / 2
    );

    const firstTabIndexCanBeCentered = state.routes.findIndex(
      (_, index) => tabsCenter[index] > tabWidth / 2
    );

    const outputRange = tabsCenter.map((center, index) => {
      if (index < firstTabIndexCanBeCentered) {
        return 0;
      }
      return center - tabWidth / 2;
    });

    const offsetX = interpolate(
      activeTabIndex.value,
      Object.keys(state.routes).map(Number),
      outputRange
    );

    scrollTo(listAnimatedRef, offsetX, 0, false);
  });

  /*---------------------------------------------*
   * Here we have render fn for tab bar item
   *---------------------------------------------*/
  const _renderItem = ({
    item,
    index,
  }: {
    item: NavigationRoute<ParamListBase, string>;
    index: number;
  }) => {
    const { options } = descriptors[item.key];

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: item.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(item.name, item.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: item.key,
      });
    };

    return (
      <Pressable
        key={item.key}
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          tabWidths.modify((value) => {
            "worklet";
            value[index] = width;
            return value;
          });
        }}
      >
        <Text className="text-neutral-300 text-lg font-medium">{options.title}</Text>
      </Pressable>
    );
  };

  /*---------------------------------------------*
   * And finally we have tab bar
   *---------------------------------------------*/
  return (
    <Animated.View style={{ opacity: dummyOpacity }} className="h-8 mb-3">
      <Reanimated.FlatList
        ref={listAnimatedRef}
        data={state.routes}
        keyExtractor={(item) => item.key}
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
        activeTabIndex={activeTabIndex}
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        tabBarOffsetX={tabBarOffsetX}
      />
    </Animated.View>
  );
}

// pinterest-navigation-between-boards-animation 🔼
