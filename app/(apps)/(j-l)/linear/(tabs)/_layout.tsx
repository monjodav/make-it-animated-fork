import Foundation from "@expo/vector-icons/Foundation";
import { router, Tabs } from "expo-router";
import { Inbox, Scan, Search, Settings, SquarePen } from "lucide-react-native";
import { Pressable } from "react-native";

enum Tab {
  Home = "home",
  Inbox = "inbox",
  Search = "search",
  Issues = "issues",
  Profile = "profile",
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "black" },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "#000",
        },
        tabBarButton: (props) => (
          <Pressable onPress={props.onPress} style={props.style}>
            {props.children}
          </Pressable>
        ),
        headerRight: () => (
          <Pressable className="flex-row items-center mr-4" onPress={router.back}>
            <Settings size={28} color="#777777" />
          </Pressable>
        ),
      })}
    >
      <Tabs.Screen
        name={Tab.Home}
        options={{
          tabBarIcon: ({ color }) => <Foundation name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Inbox}
        options={{
          tabBarIcon: ({ color }) => <Inbox size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Search}
        options={{
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Issues}
        options={{
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Profile}
        options={{
          tabBarIcon: ({ color }) => <SquarePen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default function LinearLayout() {
  return <TabsLayout />;
}
