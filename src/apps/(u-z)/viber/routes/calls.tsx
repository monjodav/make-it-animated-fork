import React, { useState } from "react";
import { View } from "react-native";
import { CallsList } from "../components/calls-list";
import { CallsRecentList } from "../components/calls-recent-list";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { LargeTitle } from "../components/large-title";
import { SearchBar } from "../components/search-bar";
import { Tab, TopTabs } from "../components/top-tabs";

// viber-header-large-title-animation 🔽

export default function Calls() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [largeTitleHeight, setLargeTitleHeight] = useState(0);
  const [activeTab, setActiveTab] = useState(Tab.Contacts);

  const offsetY = useSharedValue(0);

  const rListHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            offsetY.value,
            [-100, 0, largeTitleHeight],
            [100, 0, -largeTitleHeight],
            {
              extrapolateRight: "clamp",
            }
          ),
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-black">
      {activeTab === Tab.Contacts && (
        <CallsList
          offsetY={offsetY}
          headerHeight={headerHeight}
          largeTitleHeight={largeTitleHeight}
        />
      )}
      {activeTab === Tab.Recent && <CallsRecentList headerHeight={headerHeight} />}
      <Animated.View
        className="absolute top-0 left-0 right-0 px-5 pb-2 bg-black"
        style={rListHeaderStyle}
        onLayout={({ nativeEvent }) => {
          if (headerHeight === 0) {
            setHeaderHeight(nativeEvent.layout.height);
          }
        }}
      >
        <View
          onLayout={({ nativeEvent }) => {
            if (largeTitleHeight === 0) {
              setLargeTitleHeight(nativeEvent.layout.height);
            }
          }}
        >
          <LargeTitle title="Calls" offsetY={offsetY} className="mb-4 pt-4" />
        </View>
        <SearchBar height={36} marginBottomMax={16} />
        {/* viber-calls-top-tabs-animation 🔽 */}
        <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* viber-calls-top-tabs-animation 🔼 */}
        <View className="h-px bg-neutral-800/75 mt-3 mb-2 -mx-5" />
        {activeTab === Tab.Contacts && <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
      </Animated.View>
    </View>
  );
}

// viber-header-large-title-animation 🔼
