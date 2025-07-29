import React, { FC } from "react";
import { View, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// viber-calls-top-tabs-animation 🔽

// Container padding affects indicator positioning calculations and visual spacing
// Small 3px value creates tight, compact tab appearance matching Viber's design
const _padding = 3;

// Tab enum provides type-safe state management and animation index mapping
// Numeric values (0,1) directly correspond to indicator position calculations
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
  // Coordinates text color and scale animations for active/inactive states
  // withTiming provides smooth transitions without specifying duration (uses default 300ms)
  const rTextStyle = useAnimatedStyle(() => {
    return {
      // Color transition: white (#FFFFFF) active, muted gray (#A1A1A4) inactive for contrast
      color: withTiming(active ? "#FFFFFF" : "#A1A1A4"),
      transform: [
        {
          // Scale animation: 1.05x active (5% larger), 0.95x inactive (5% smaller)
          // Creates subtle emphasis effect that draws attention to selected tab
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
  // Tracks container width for responsive indicator positioning calculations
  // Updated via onLayout callback when component dimensions change
  const tabsWidth = useSharedValue(0);

  // Drives indicator position and width animations based on active tab state
  // Coordinates sliding motion between tab positions with precise calculations
  const rIndicatorStyle = useAnimatedStyle(() => {
    return {
      // Indicator width: exactly half of container width for equal tab coverage
      width: tabsWidth.value / 2,
      // Position calculation: Contacts tab = left edge + padding
      // Recent tab = center position accounting for padding on both sides
      // Formula: (totalWidth - 2*padding) / 2 positions indicator at second tab
      left: withTiming(
        activeTab === Tab.Contacts ? _padding : (tabsWidth.value - 2 * _padding) / 2,
        {
          // 200ms duration provides snappy response without feeling rushed
          // Matches typical iOS tab switching timing for familiar UX
          duration: 200,
        }
      ),
    };
  });

  return (
    <View
      className="rounded-lg bg-neutral-900 flex-row items-center"
      style={{ padding: _padding }}
      // Measures container width for indicator position calculations
      // Triggers whenever layout changes (orientation, parent resize)
      onLayout={(e) => (tabsWidth.value = e.nativeEvent.layout.width)}
    >
      {/* Sliding indicator positioned absolutely to move independently of tab items */}
      {/* Purple background (#7F61F2) matches Viber's brand color scheme */}
      {/* Rounded corners (6px) slightly less than container (8px from rounded-lg) for inset appearance */}
      <Animated.View
        className="absolute rounded-[6px] bg-[#7F61F2]"
        // Combines animated left/width with fixed top/bottom positioning
        // top/bottom padding ensures indicator doesn't touch container edges
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
