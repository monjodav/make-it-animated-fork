import React, { useState } from "react";
import { View } from "react-native";
import { Tab, TopTabs } from "@/components/viber/top-tabs";
import { CallsList } from "@/components/viber/calls-list";
import { CallsRecentList } from "@/components/viber/calls-recent-list";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LargeTitle } from "@/components/viber/large-title";
import { SearchBar } from "@/components/viber/search-bar";

// viber-header-large-title-animation 🔽

export default function Calls() {
  const [activeTab, setActiveTab] = useState(Tab.Contacts);

  const offsetY = useSharedValue(0);
  const largeTitleHeight = useSharedValue(0);

  const rListHeaderStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(
        offsetY.value,
        [0, largeTitleHeight.value],
        [0, -largeTitleHeight.value],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(offsetY.value, [-100, 0], [100, 0], {
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.View className="px-5 pb-2" style={rListHeaderStyle}>
        <View onLayout={({ nativeEvent }) => largeTitleHeight.set(nativeEvent.layout.height)}>
          <LargeTitle title="Calls" offsetY={offsetY} className="mb-4 pt-4" />
        </View>
        <SearchBar height={36} marginBottomMax={16} />
        {/* viber-top-tabs-indicator-animation 🔽 */}
        <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* viber-top-tabs-indicator-animation 🔼 */}
        <View className="h-px bg-neutral-800/75 mt-3 mb-2 -mx-5" />
        {activeTab === Tab.Contacts && <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
      </Animated.View>
      {activeTab === Tab.Contacts && (
        <CallsList offsetY={offsetY} largeTitleHeight={largeTitleHeight} />
      )}
      {activeTab === Tab.Recent && <CallsRecentList />}
    </View>
  );
}

// viber-header-large-title-animation 🔼
