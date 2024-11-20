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
const _gap = 16;
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

  const allIssuesWidth = useSharedValue(0);
  const activeWidth = useSharedValue(0);
  const backlogWidth = useSharedValue(0);
  const triageWidth = useSharedValue(0);
  const currentCycleWidth = useSharedValue(0);
  const upcomingCycleWidth = useSharedValue(0);

  const allIssuesX = useDerivedValue(() => _sidePadding);
  const activeX = useDerivedValue(() => _sidePadding + allIssuesWidth.value + _gap);
  const backlogX = useDerivedValue(
    () => _sidePadding + allIssuesWidth.value + activeWidth.value + _gap * 2
  );
  const triageX = useDerivedValue(
    () => _sidePadding + allIssuesWidth.value + activeWidth.value + backlogWidth.value + _gap * 3
  );
  const currentCycleX = useDerivedValue(
    () =>
      _sidePadding +
      allIssuesWidth.value +
      activeWidth.value +
      backlogWidth.value +
      triageWidth.value +
      _gap * 4
  );
  const upcomingCycleX = useDerivedValue(
    () =>
      _sidePadding +
      allIssuesWidth.value +
      activeWidth.value +
      backlogWidth.value +
      triageWidth.value +
      currentCycleWidth.value +
      _gap * 5
  );

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
      // isActive={activeTab === item.value}
      onPress={() => {
        setActiveTab(item.value);
      }}
      onLayout={(event) => {
        const { width, x } = event.nativeEvent.layout;
        if (item.value === Tab.AllIssues) {
          allIssuesWidth.value = width;
        }
        if (item.value === Tab.Active) {
          activeWidth.value = width;
        }
        if (item.value === Tab.Backlog) {
          backlogWidth.value = width;
        }
        if (item.value === Tab.Triage) {
          triageWidth.value = width;
        }
        if (item.value === Tab.CurrentCycle) {
          currentCycleWidth.value = width;
        }
        if (item.value === Tab.UpcomingCycle) {
          upcomingCycleWidth.value = width;
        }
      }}
    />
  );

  return (
    <View>
      <TabIndicator
        activeTab={activeTab}
        tabBarOffsetX={offsetX}
        allIssuesWidth={allIssuesWidth}
        allIssuesX={allIssuesX}
        activeWidth={activeWidth}
        activeX={activeX}
        backlogWidth={backlogWidth}
        backlogX={backlogX}
        triageWidth={triageWidth}
        triageX={triageX}
        currentCycleWidth={currentCycleWidth}
        currentCycleX={currentCycleX}
        upcomingCycleWidth={upcomingCycleWidth}
        upcomingCycleX={upcomingCycleX}
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
