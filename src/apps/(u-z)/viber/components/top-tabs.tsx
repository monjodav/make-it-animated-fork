import React, { FC } from "react";
import { View, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// viber-calls-top-tabs-animation 🔽

const _padding = 3;

export enum Tab {
  Contacts = 0,
  Recent = 1,
}

type TabItemProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

const TabItem: FC<TabItemProps> = ({ title, active, onPress }) => {
  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(active ? "#FFFFFF" : "#A1A1A4"),
      transform: [
        {
          scale: withTiming(active ? 1.05 : 0.95),
        },
      ],
    };
  });

  return (
    <Pressable className="flex-1 items-center py-[6px]" onPress={onPress}>
      <Animated.Text className="text-sm font-medium" style={rTextStyle}>
        {title}
      </Animated.Text>
    </Pressable>
  );
};

type Props = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

export const TopTabs: FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabsWidth = useSharedValue(0);

  const rIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: tabsWidth.value / 2,
      left: withTiming(
        activeTab === Tab.Contacts ? _padding : (tabsWidth.value - 2 * _padding) / 2,
        {
          duration: 200,
        }
      ),
    };
  });

  return (
    <View
      className="rounded-lg bg-neutral-900 flex-row items-center"
      style={{ padding: _padding }}
      onLayout={(e) => (tabsWidth.value = e.nativeEvent.layout.width)}
    >
      <Animated.View
        className="absolute rounded-[6px] bg-[#7F61F2]"
        style={[rIndicatorStyle, { top: _padding, bottom: _padding }]}
      />
      <TabItem
        title="Contacts"
        active={activeTab === Tab.Contacts}
        onPress={() => setActiveTab(Tab.Contacts)}
      />
      <TabItem
        title="Recent"
        active={activeTab === Tab.Recent}
        onPress={() => setActiveTab(Tab.Recent)}
      />
    </View>
  );
};

// viber-calls-top-tabs-animation 🔼
