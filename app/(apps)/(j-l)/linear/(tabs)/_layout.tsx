import { ScrollProvider, useScrollContext } from "@/src/apps/(j-l)/linear/lib/scroll-provider";
import Foundation from "@expo/vector-icons/Foundation";
import { Tabs } from "expo-router";
import { Inbox, Scan, Search, SquarePen } from "lucide-react-native";
import { Pressable } from "react-native";

enum Tab {
  Home = "home",
  Inbox = "inbox",
  Search = "search",
  Issues = "issues",
  Profile = "profile",
}

const TabsLayout = () => {
  const { scrollY } = useScrollContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
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
  return (
    <ScrollProvider>
      <TabsLayout />
    </ScrollProvider>
  );
}
