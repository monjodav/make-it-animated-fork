import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { FC, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { TabIndicator } from "./tab-indicator";
import { TabItem, TabItemProps } from "./tab-item";

const _sidePadding = 20;
const _gap = 8;
const _iconColor = "#A1A1A4";

export enum Tab {
  AllIssues = 0,
  Active = 1,
  Backlog = 2,
  Triage = 3,
  CurrentCycle = 4,
  UpcomingCycle = 5,
}

type Tabs = Pick<TabItemProps, "icon" | "label" | "value">[];

const tabs: Tabs = [
  {
    icon: <AntDesign name="copy1" size={12} color={_iconColor} />,
    label: "All Issues",
    value: Tab.AllIssues,
  },
  {
    icon: <Feather name="copy" size={12} color={_iconColor} />,
    label: "Active",
    value: Tab.Active,
  },
  {
    icon: (
      <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={12} color={_iconColor} />
    ),
    label: "Backlog",
    value: Tab.Backlog,
  },
  {
    icon: <Entypo name="500px-with-circle" size={12} color={_iconColor} />,
    label: "Triage",
    value: Tab.Triage,
  },
  {
    icon: (
      <MaterialCommunityIcons name="arrow-right-drop-circle-outline" size={12} color={_iconColor} />
    ),
    label: "Current Cycle",
    value: Tab.CurrentCycle,
  },
  {
    icon: (
      <MaterialCommunityIcons name="arrow-right-drop-circle-outline" size={12} color={_iconColor} />
    ),
    label: "Upcoming Cycle",
    value: Tab.UpcomingCycle,
  },
];

export const TabBar: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AllIssues);

  const tabWidths = useSharedValue<number[]>(new Array(tabs.length).fill(0));

  const tabOffsets = useDerivedValue(() => {
    return tabWidths.value.reduce<number[]>((acc, _width, index) => {
      const previousX = index === 0 ? _sidePadding : acc[index - 1];
      const previousWidth = index === 0 ? 0 : tabWidths.value[index - 1];
      acc[index] = previousX + previousWidth + (index === 0 ? 0 : _gap);
      return acc;
    }, []);
  });

  const animatedRef = useAnimatedRef<Animated.FlatList<Tabs>>();

  const offsetX = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onMomentumEnd: () => {
      isScrolling.value = false;
    },
  });

  const _renderItem = ({ item, index }: { item: Tabs[number]; index: number }) => (
    <TabItem
      icon={item.icon}
      label={item.label}
      value={item.value}
      isActive={activeTab === item.value}
      onPress={() => {
        setActiveTab(item.value);
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        tabWidths.modify((value) => {
          "worklet";
          value[index] = width;
          return value;
        });
      }}
    />
  );

  return (
    <View>
      <TabIndicator
        activeTab={activeTab}
        tabBarOffsetX={offsetX}
        tabWidths={tabWidths}
        tabOffsets={tabOffsets}
        isScrolling={isScrolling}
      />
      <Animated.FlatList
        ref={animatedRef}
        data={tabs}
        keyExtractor={(item) => item.value.toString()}
        renderItem={_renderItem}
        horizontal
        contentContainerStyle={{ paddingHorizontal: _sidePadding, gap: _gap }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
      />
    </View>
  );
};
