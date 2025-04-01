import { Tabs } from "expo-router";
import { Cog, MessagesSquare, Phone } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

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
          tabBarIcon: ({ color }) => <Phone size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Search}
        options={{
          tabBarIcon: ({ color }) => <Phone size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.AddContent}
        options={{
          tabBarIcon: ({ color }) => <Phone size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Reels}
        options={{
          tabBarIcon: ({ color }) => <MessagesSquare size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Account}
        options={{
          tabBarIcon: ({ color }) => <Cog size={20} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
