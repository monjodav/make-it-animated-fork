import { SearchProvider, useSearch } from "@/src/apps/(j-l)/linear/lib/providers/search-provider";
import Foundation from "@expo/vector-icons/Foundation";
import { router, Tabs } from "expo-router";
import { Inbox, Scan, Search, Settings, SquarePen } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SearchOverlay } from "@/src/apps/(j-l)/linear/components/search-overlay";
import { AnimatedTabsContainer } from "@/src/apps/(j-l)/linear/components/animated-tabs-container";

enum Tab {
  Home = "home",
  Inbox = "inbox",
  Search = "search",
  Issues = "issues",
  Profile = "profile",
}

const TabsLayout = () => {
  const { searchProgress, openSearch } = useSearch();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: searchProgress.get() === 0,
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
          return (
            <Pressable
              onPress={(e) => {
                props.onPress?.(e);
                if (route.name === Tab.Search) openSearch();
              }}
              style={props.style}
            >
              {props.children}
            </Pressable>
          );
        },
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
  return (
    <SearchProvider>
      <View className="flex-1 bg-linear-back">
        <AnimatedTabsContainer>
          <TabsLayout />
        </AnimatedTabsContainer>
        <SearchOverlay />
      </View>
    </SearchProvider>
  );
}
