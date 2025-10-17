import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import Foundation from "@expo/vector-icons/Foundation";
import { Tabs } from "expo-router";
import { Inbox, Scan, Search, Settings, SquarePen } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { AnimatedTabsContainer } from "@/src/apps/(j-l)/linear/components/animated-tabs-container";
import { use } from "react";
import { SearchTransitionContext } from "../_layout";

enum Tab {
  Home = "home",
  Inbox = "inbox",
  Search = "search",
  Issues = "issues",
  Profile = "profile",
}

const TabsLayout = () => {
  const { onOpenSearchModal } = use(SearchTransitionContext);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: "",
        headerStyle: { backgroundColor: "#0A090C" },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "#0A090C",
        },
        tabBarButton: (props) => {
          if (route.name === Tab.Search) {
            return (
              <Pressable accessibilityRole="button" style={props.style} onPress={onOpenSearchModal}>
                {props.children}
              </Pressable>
            );
          }
          return (
            <Pressable onPress={props.onPress} style={props.style}>
              {props.children}
            </Pressable>
          );
        },
        headerRight: () => (
          <Pressable className="flex-row items-center right-4" onPress={simulatePress}>
            <Settings size={20} color="#777777" />
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
  return (
    <View className="flex-1 bg-linear-back">
      <AnimatedTabsContainer>
        <TabsLayout />
      </AnimatedTabsContainer>
    </View>
  );
}
