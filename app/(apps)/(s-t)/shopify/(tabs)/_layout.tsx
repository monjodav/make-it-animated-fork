import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { House, Inbox, Menu, SearchIcon, Tag, User } from "lucide-react-native";
import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { cn } from "@/src/shared/lib/utils/cn";

enum Tab {
  Search = "search",
  Home = "home",
  Orders = "orders",
  Products = "products",
  Menu = "menu",
  Profile = "profile",
}

const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  // Helper to check if a tab is focused
  const isTabFocused = (routeName: string) => {
    const index = state.routes.findIndex((route) => route.name === routeName);
    return state.index === index;
  };

  return (
    <View className="absolute bottom-0 flex-row items-center justify-between px-5 mb-10 gap-2 shadow-[0_0px_20px_10px_rgba(218,218,218,0.8)]">
      <View className="p-1 rounded-full bg-white border-2 border-gray-300">
        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Search) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Search)}
        >
          <SearchIcon size={22} color={isTabFocused(Tab.Search) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-row items-center justify-around py-1  bg-white  rounded-full border-2 border-gray-300">
        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Home) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Home)}
        >
          <House size={22} color={isTabFocused(Tab.Home) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>

        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Orders) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Orders)}
        >
          <Inbox size={22} color={isTabFocused(Tab.Orders) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>

        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Products) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Products)}
        >
          <Tag size={22} color={isTabFocused(Tab.Products) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>

        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Menu) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Menu)}
        >
          <Menu size={22} color={isTabFocused(Tab.Menu) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>
      </View>

      <View className="p-1 rounded-full bg-white border-2 border-gray-300">
        <TouchableOpacity
          className={cn("p-4 rounded-full", isTabFocused(Tab.Profile) ? "bg-zinc-200" : "white")}
          onPress={() => navigation.navigate(Tab.Profile)}
        >
          <User size={22} color={isTabFocused(Tab.Profile) ? "#000000" : "#8a8a8a"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name={Tab.Search} />
      <Tabs.Screen name={Tab.Home} />
      <Tabs.Screen name={Tab.Orders} />
      <Tabs.Screen name={Tab.Products} />
      <Tabs.Screen name={Tab.Menu} />
      <Tabs.Screen name={Tab.Profile} />
    </Tabs>
  );
};

export default TabsLayout;
