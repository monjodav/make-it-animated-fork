import { Tabs } from "expo-router";
import { Cog, MessageCircle, MessagesSquare, MoreHorizontal, Phone } from "lucide-react-native";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, View } from "react-native";

enum Tab {
  Updates = "updates",
  Calls = "calls",
  Communities = "communities",
  Chats = "chats",
  Settings = "settings",
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
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
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} />,
      }}
    >
      <Tabs.Screen
        name={Tab.Updates}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerTransparent: true,
          tabBarLabel: "Updates",
          tabBarIcon: ({ color }) => <MessageCircle size={20} color={color} />,
          headerLeft: () => (
            <Pressable className="ml-5 p-1 rounded-full bg-neutral-900">
              <MoreHorizontal size={18} color="lightgray" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name={Tab.Calls}
        options={{
          tabBarLabel: "Calls",
          tabBarIcon: ({ color }) => <Phone size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Communities}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerTransparent: true,
          tabBarLabel: "Communities",
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Chats}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => <MessagesSquare size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => <Cog size={20} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
