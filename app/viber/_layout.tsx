import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ellipsis, LayoutGrid, Phone } from "lucide-react-native";
import React from "react";

enum Tab {
  Chats = "chats",
  Calls = "calls",
  Explore = "explore",
  More = "more",
}

const TabsLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
          headerTransparent: true,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#7F61F2",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            borderTopColor: "#ffffff20",
            borderTopWidth: 0.5,
            backgroundColor: "black",
          },
        }}
      >
        <Tabs.Screen
          name={Tab.Chats}
          options={{
            tabBarLabel: "Chats",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="message-processing" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Calls}
          options={{
            tabBarLabel: "Calls",
            tabBarIcon: ({ color }) => <Phone size={20} color={color} fill={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Explore}
          options={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ color }) => <LayoutGrid size={20} color={color} fill={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.More}
          options={{
            tabBarLabel: "More",
            tabBarIcon: ({ color }) => <Ellipsis size={24} color={color} fill={color} />,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
