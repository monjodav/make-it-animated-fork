import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Camera, Ellipsis, LayoutGrid, Phone, SquarePen } from "lucide-react-native";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";

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
            headerRight: () => (
              <View className="flex-row items-center gap-5 pr-4 pb-1">
                <TouchableOpacity
                  activeOpacity={0.9}
                  hitSlop={15}
                  onPress={() => Alert.alert("Take a photo")}
                >
                  <Camera size={20} color="#7F61F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  hitSlop={15}
                  onPress={() => Alert.alert("Create a chat")}
                >
                  <SquarePen size={18} color="#7F61F2" />
                </TouchableOpacity>
              </View>
            ),
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
