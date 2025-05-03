import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Board } from "../../lib/types";
import { MasonryList } from "./masonry-list";
import { useWindowDimensions, View, Text } from "react-native";
import React, { useEffect } from "react";
import { TabBar } from "../tab-bar";

import { useNavigation, usePathname, useRouter } from "expo-router";
import createCollapsibleNavigator from "@/src/shared/components/create-collapsible-navigator";
import { CollapsibleRef, Tabs } from " ";
import { Pressable } from "react-native-gesture-handler";

// pinterest-navigation-between-boards-animation 🔽

const Tab = createCollapsibleNavigator();

type Props = {
  boards: Board[];
};

export function Boards({ boards }: Props) {
  const { width } = useWindowDimensions();

  const path = usePathname();
  const navigation = useNavigation();

  return (
    <>
      <Tab.Navigator
        collapsibleOptions={{
          renderTabBar: (props) => <TabBar {...props} />,
        }}
      >
        {boards.map((board) => (
          <Tab.Screen key={board.slug} name={board.slug}>
            {() => <MasonryList board={board} />}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
      <View className="absolute top-[200px] left-[50px]">
        <Text className="text-pink-400">{path}</Text>
      </View>
      <Pressable
        className="absolute top-[300px] left-[50px]"
        onPress={() => navigation.navigate("colorsapp")}
      >
        <Text className="text-pink-400">Jump to board 1</Text>
      </Pressable>
    </>
  );
}

// pinterest-navigation-between-boards-animation 🔼
