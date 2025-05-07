import React, { FC, useRef } from "react";
import { View } from "react-native";
import { Board } from "../lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "react-native-collapsible-tab-view";
import { useScrollToTop } from "@react-navigation/native";
import { MasonryList } from "../components/masonry-list";
import { TabBar } from "../components/tab-bar";

// pinterest-navigation-between-boards-animation 🔽

const boards: Board[] = [
  {
    name: "All",
    pins: Array.from({ length: 24 }),
  },
  {
    name: "ColorsApp",
    pins: Array.from({ length: 31 }),
  },
  {
    name: "project-1",
    pins: Array.from({ length: 26 }),
  },
  {
    name: "Cafe Design Ideas",
    pins: Array.from({ length: 14 }),
  },
  {
    name: "furniture",
    pins: Array.from({ length: 7 }),
  },
  {
    name: "Cafe decoration",
    pins: Array.from({ length: 10 }),
  },
  {
    name: "wild room coffee place",
    pins: Array.from({ length: 20 }),
  },
  {
    name: "Food and drinks",
    pins: Array.from({ length: 30 }),
  },
  {
    name: "Logo",
    pins: Array.from({ length: 17 }),
  },
];

export const Home: FC = () => {
  const containerRef = useRef(null);
  useScrollToTop(containerRef);

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Tabs.Container
        ref={containerRef}
        headerContainerStyle={{
          backgroundColor: "black",
        }}
        renderTabBar={(props) => <TabBar {...props} />}
        initialTabName="All"
      >
        {boards.map((board) => (
          <Tabs.Tab key={board.name} name={board.name}>
            <MasonryList board={board} />
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </View>
  );
};

// pinterest-navigation-between-boards-animation 🔼
