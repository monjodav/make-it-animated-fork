import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

enum Tab {
  Home = "home",
  Blocks = "blocks",
  ScreenTime = "screen-time",
  Leaderboard = "leaderboard",
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
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0,
        },
        tabBarButton: (props) => (
          <Pressable
            onPress={props.onPress}
            style={props.style}
            android_ripple={{ color: "transparent" }}
          >
            {props.children}
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name={Tab.Home}
        options={{
          tabBarIcon: ({ color }) => <Foundation name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Blocks}
        options={{
          tabBarIcon: ({ color }) => <Foundation name="folder-add" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.ScreenTime}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="chart-simple" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Leaderboard}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Account}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
