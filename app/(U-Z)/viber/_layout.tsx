import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Camera, Ellipsis, LayoutGrid, Phone, SquarePen } from "lucide-react-native";
import React from "react";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colorKit } from "reanimated-color-picker";

enum Tab {
  Chats = "chats",
  Calls = "calls",
  Explore = "explore",
  More = "more",
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleAlign: "center",
        headerTintColor: "white",
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#7F61F2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderColor: colorKit.setAlpha("#fff", 0.2).hex(),
          borderTopWidth: 0.5,
          backgroundColor: "black",
        },
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} />,
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
          headerRight: () => (
            <View className="flex-row items-center gap-5 pr-4 pb-1">
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Add contact")}
              >
                <FontAwesome6 name="user-plus" size={18} color="#7F61F2" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Open keypad")}
              >
                <Ionicons name="keypad" size={18} color="#7F61F2" />
              </TouchableOpacity>
            </View>
          ),
          tabBarLabel: "Calls",
          tabBarIcon: ({ color }) => <Phone size={20} color={color} fill={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Explore}
        options={{
          headerShown: false,
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) => <LayoutGrid size={20} color={color} fill={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.More}
        options={{
          headerShown: false,
          tabBarLabel: "More",
          tabBarIcon: ({ color }) => <Ellipsis size={24} color={color} fill={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
