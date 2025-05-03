import React, { FC, useRef } from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { HomeHeader } from "../components/home-header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopTabs } from "../components/top-tabs";
import { HomeTabContent } from "../components/home-tab-content";
import { useScrollToTop } from "@react-navigation/native";

// threads-home-header-tabs-animation 🔽

export const Home: FC = () => {
  const containerRef = useRef(null);
  useScrollToTop(containerRef);

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <Tabs.Container
        ref={containerRef}
        renderHeader={() => <HomeHeader />}
        headerContainerStyle={{
          backgroundColor: "#0a0a0a",
          borderBottomWidth: 0.5,
          borderBottomColor: "#262626",
        }}
        renderTabBar={(props) => <TopTabs {...props} />}
        initialTabName="For You"
        revealHeaderOnScroll
      >
        <Tabs.Tab name="For You">
          <HomeTabContent tabName="For You" />
        </Tabs.Tab>
        <Tabs.Tab name="Following">
          <HomeTabContent tabName="Following" />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

// threads-home-header-tabs-animation 🔼
