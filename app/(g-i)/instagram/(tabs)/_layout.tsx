import { Tabs } from "expo-router";
import { Home, PlaySquare, Search, UserCircle } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

enum Tab {
  Home = "home",
  Search = "search",
  AddContent = "add-content",
  Reels = "reels",
  Account = "account",
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "#000",
        },
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} />,
      }}
    >
      <Tabs.Screen
        name={Tab.Home}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Search}
        options={{
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.AddContent}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="plus-square-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Reels}
        options={{
          tabBarIcon: ({ color }) => <PlaySquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Account}
        options={{
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
