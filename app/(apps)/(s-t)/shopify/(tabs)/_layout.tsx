import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { House, Inbox, Menu, SearchIcon, Tag, User } from "lucide-react-native";
import React, { FC, ReactNode, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/src/shared/lib/utils/cn";
import { MenuProvider, useMenu } from "@/src/apps/(s-t)/shopify/lib/providers/menu-provider";

// shopify-custom-bottom-tabs-animation 🔽
// shopify-menu-transition-animation 🔽

enum Tab {
  Search = "search",
  Home = "home",
  Orders = "orders",
  Products = "products",
  Menu = "menu",
  Profile = "profile",
}

interface TabButtonProps {
  focused: boolean;
  onPress: () => void;
  children: ReactNode;
}

const TabButton: FC<TabButtonProps> = ({ focused, onPress, children }) => {
  const scale = useSharedValue(1);
  const bg = useSharedValue(focused ? "#F5F5F5" : "white");

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    backgroundColor: withTiming(bg.value, { duration: 150 }),
  }));

  // Sync with navigation focus updates
  useEffect(() => {
    setTimeout(() => {
      bg.value = focused ? "#F5F5F5" : "white";
    }, 32); // slight delay to avoid jank on quick taps
  }, [focused]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        if (focused) {
          scale.value = 0.9;
          return;
        }
        scale.value = 0.9;
        bg.value = "#FAFAFA"; // temporary pressed state
      }}
      onPressOut={() => {
        scale.value = 1;
        if (focused) {
          // Reapply active color if still focused
          bg.value = "#F5F5F5";
        } else {
          bg.value = "white";
        }
      }}
    >
      <Animated.View className={cn("p-4 rounded-full")} style={rStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { menuProgress } = useMenu();

  // Helper to check if a tab is focused
  const isTabFocused = (routeName: string) => {
    const index = state.routes.findIndex((route) => route.name === routeName);
    return state.index === index;
  };

  /**
   * Animated style for entire tab bar
   * - Uses menuProgress shared value to shift bar vertically
   * - Interpolates [0 → 1] progress into bottom margin [30 → 20]
   *   so the bar moves slightly upward when menu opens
   * - withTiming ensures smooth easing (300ms)
   */
  const rButtonStyle = useAnimatedStyle(() => {
    const bottom = withTiming(interpolate(menuProgress.get(), [0, 1], [30, 20]), {
      duration: 300, // chosen for consistent UI timing across transitions
    });

    return {
      marginBottom: bottom, // applied as bottom spacing to float the bar
    };
  });

  return (
    <Animated.View
      className="absolute bottom-0 flex-row items-center justify-between px-5 gap-2 shadow-[0_0px_20px_10px_rgba(218,218,218,0.8)]"
      style={rButtonStyle} // animated bottom spacing driven by menuProgress
    >
      <View className="p-1 rounded-full bg-white" style={[styles.buttonBorder, styles.shadow]}>
        <TabButton
          focused={isTabFocused(Tab.Search)}
          onPress={() => navigation.navigate(Tab.Search)}
        >
          <SearchIcon size={22} color={isTabFocused(Tab.Search) ? "#000000" : "#8a8a8a"} />
        </TabButton>
      </View>

      <View
        className="flex-1 flex-row items-center justify-around py-1 bg-white rounded-full"
        style={[styles.buttonBorder, styles.shadow]}
      >
        <TabButton focused={isTabFocused(Tab.Home)} onPress={() => navigation.navigate(Tab.Home)}>
          <House size={22} color={isTabFocused(Tab.Home) ? "#000000" : "#8a8a8a"} />
        </TabButton>

        <TabButton
          focused={isTabFocused(Tab.Orders)}
          onPress={() => navigation.navigate(Tab.Orders)}
        >
          <Inbox size={22} color={isTabFocused(Tab.Orders) ? "#000000" : "#8a8a8a"} />
        </TabButton>

        <TabButton
          focused={isTabFocused(Tab.Products)}
          onPress={() => navigation.navigate(Tab.Products)}
        >
          <Tag
            size={22}
            color={isTabFocused(Tab.Products) ? "#000000" : "#8a8a8a"}
            style={{ transform: [{ rotateY: "180deg" }] }}
          />
        </TabButton>

        <TabButton
          focused={isTabFocused(Tab.Menu)}
          onPress={() => {
            menuProgress.set(1);
          }}
        >
          <Menu size={22} color={isTabFocused(Tab.Menu) ? "#000000" : "#8a8a8a"} />
        </TabButton>
      </View>

      <View className="p-1 rounded-full bg-white" style={[styles.buttonBorder, styles.shadow]}>
        <TabButton
          focused={isTabFocused(Tab.Profile)}
          onPress={() => navigation.navigate(Tab.Profile)}
        >
          <User size={22} color={isTabFocused(Tab.Profile) ? "#000000" : "#8a8a8a"} />
        </TabButton>
      </View>
    </Animated.View>
  );
};

const TabsLayout = () => {
  return (
    <MenuProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // disable default RN bottom tabs for full custom animation control
          sceneStyle: { backgroundColor: "black" }, // keeps transitions consistent with dark overlay
        }}
      >
        <Tabs.Screen name={Tab.Search} />
        <Tabs.Screen name={Tab.Home} />
        <Tabs.Screen name={Tab.Orders} />
        <Tabs.Screen name={Tab.Products} />
        <Tabs.Screen name={Tab.Profile} />
      </Tabs>
    </MenuProvider>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  buttonBorder: { borderWidth: 1, borderColor: "#F1F1F1" },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

// shopify-menu-transition-animation 🔼
// shopify-custom-bottom-tabs-animation 🔼
