import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Board } from "../../lib/types";
import { MasonryList } from "./masonry-list";
import { useWindowDimensions } from "react-native";
import React from "react";
import { TabBar } from "../tab-bar";

// pinterest-navigation-between-boards-animation 🔽

const Tab = createMaterialTopTabNavigator();

type Props = {
  boards: Board[];
};

export function Boards({ boards }: Props) {
  const { width } = useWindowDimensions();

  return (
    <Tab.Navigator
      initialLayout={{ width }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ lazy: true, lazyPreloadDistance: 0 }}
    >
      {boards.map((board) => (
        <Tab.Screen
          key={board.slug}
          name={board.slug}
          options={{ title: board.title, sceneStyle: { backgroundColor: "black" } }}
        >
          {() => <MasonryList board={board} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

// pinterest-navigation-between-boards-animation 🔼
