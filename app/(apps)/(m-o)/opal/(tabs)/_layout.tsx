import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";

enum Tab {
  Home = "home",
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
    </Tabs>
  );
};

export default TabsLayout;
