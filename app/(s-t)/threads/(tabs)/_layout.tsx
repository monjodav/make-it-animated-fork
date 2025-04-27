import { Tabs } from "expo-router";
import { Heart, Plus, Search } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useBottomTabsStore } from "@/src/apps/(s-t)/threads/lib/store/bottom-tabs";

enum Tab {
  Home = "home",
  Search = "search",
  Add = "add",
  Activity = "activity",
  Profile = "profile",
}

const TabsLayout = () => {
  const isBottomTabsHidden = useBottomTabsStore.use.isBottomTabsHidden();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          position: "absolute",
          opacity: isBottomTabsHidden ? 0 : 1,
          borderTopWidth: 0,
          backgroundColor: "#0a0a0a",
        },
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} />,
      }}
    >
      <Tabs.Screen
        name={Tab.Home}
        options={{
          tabBarIcon: ({ color }) => <Foundation name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Search}
        options={{
          tabBarIcon: ({ color }) => <Search size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Add}
        options={{
          tabBarIcon: ({ color }) => (
            <View className="w-16 h-12 rounded-2xl items-center justify-center bg-neutral-900">
              <Plus size={26} color={color} strokeWidth={3} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name={Tab.Activity}
        options={{
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Profile}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
