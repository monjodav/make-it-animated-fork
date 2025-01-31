import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Cog, MessageCircle, MessagesSquare, Phone } from "lucide-react-native";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";

enum Tab {
  Updates = "updates",
  Calls = "calls",
  Communities = "communities",
  Chats = "chats",
  Settings = "settings",
}

const TabsLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <View className="absolute inset-0 bg-neutral-950/95">
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name={Tab.Updates}
          options={{
            headerShown: true,
            headerTintColor: "white",
            headerTransparent: true,
            tabBarLabel: "Updates",
            tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Calls}
          options={{
            tabBarLabel: "Calls",
            tabBarIcon: ({ color }) => <Phone size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Communities}
          options={{
            tabBarLabel: "Communities",
            tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Chats}
          options={{
            tabBarLabel: "Chats",
            tabBarIcon: ({ color }) => <MessagesSquare size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Settings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => <Cog size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
