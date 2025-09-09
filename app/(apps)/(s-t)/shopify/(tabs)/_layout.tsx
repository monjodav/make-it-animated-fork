import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Menu, SearchIcon, User } from "lucide-react-native";
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
import { Menu as MenuOverlay } from "@/src/apps/(s-t)/shopify/components/menu";
import House from "@/src/apps/(s-t)/shopify/icons/houseIcon";
import Inbox from "@/src/apps/(s-t)/shopify/icons/inboxIcon";
import Tag from "@/src/apps/(s-t)/shopify/icons/tagIcon";

// shopify-custom-bottom-tabs-animation 🔽
// shopify-menu-transition-animation 🔽

// Animation constants: Fine-tuned for responsive feel without being jarring
const BUTTON_SCALE_DURATION = 150; // Fast enough for instant feedback, slow enough to see the animation
const BUTTON_SCALE_PRESSED = 0.9; // 10% scale reduction creates noticeable but not excessive squeeze effect
const BG_SYNC_DELAY = 32; // Prevents background flash on rapid navigation changes
const TAB_BAR_ANIMATION_DURATION = 300; // Matches menu transition for visual cohesion

enum Tab {
  Search = "search",
  Home = "home",
  Orders = "orders",
  Products = "products",
  Menu = "menu", // Special case: triggers menu overlay instead of navigation
  Profile = "profile",
}

interface TabButtonProps {
  focused: boolean;
  onPress: () => void;
  children: ReactNode;
}

/**
 * Individual tab button with press animations and focus states
 * Handles both visual feedback (scale/background) and state synchronization
 */
const TabButton: FC<TabButtonProps> = ({ focused, onPress, children }) => {
  // Independent animation values for responsive UI thread animations
  const scale = useSharedValue(1);
  const bg = useSharedValue(focused ? "#F5F5F5" : "white"); // Light gray for active, white for inactive

  // Combined scale and background animation for press feedback
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: BUTTON_SCALE_DURATION }) }],
    backgroundColor: withTiming(bg.value, { duration: BUTTON_SCALE_DURATION }),
  }));

  // Sync background color when focus state changes from navigation
  useEffect(() => {
    setTimeout(() => {
      bg.value = focused ? "#F5F5F5" : "white";
    }, BG_SYNC_DELAY); // Prevents flash when rapidly switching tabs
  }, [focused]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        if (focused) {
          scale.value = BUTTON_SCALE_PRESSED; // Quick press feedback for already active tab
          return;
        }
        scale.value = BUTTON_SCALE_PRESSED;
        bg.value = "#FAFAFA"; // Temporary light hover state during press
      }}
      onPressOut={() => {
        scale.value = 1; // Return to normal size
        if (focused) {
          bg.value = "#F5F5F5"; // Restore active background if still focused
        } else {
          bg.value = "white"; // Return to inactive background
        }
      }}
    >
      <Animated.View className={cn("p-4 rounded-full")} style={rStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Custom tab bar implementation with menu integration and press animations
 * Coordinates with menu overlay state via shared menuProgress value
 */
const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { menuProgress } = useMenu(); // Shared animation state with menu overlay

  // Helper to check if a tab is focused
  const isTabFocused = (routeName: string) => {
    const index = state.routes.findIndex((route) => route.name === routeName);
    return state.index === index;
  };

  /**
   * Tab bar position animation coordinated with menu overlay
   * Range [30→20]: Moves tab bar 10px upward when menu opens to create depth
   * Timing matches menu animation for synchronized motion
   */
  const rButtonStyle = useAnimatedStyle(() => {
    const bottom = withTiming(interpolate(menuProgress.value, [0, 1], [30, 20]), {
      duration: TAB_BAR_ANIMATION_DURATION, // Synchronized with menu transition timing
    });

    return {
      marginBottom: bottom, // Bottom spacing creates floating effect above safe area
    };
  });

  return (
    <Animated.View
      className="absolute bottom-0 flex-row items-center justify-between px-5 gap-2 shadow-[0_0px_20px_10px_rgba(218,218,218,0.8)]"
      style={rButtonStyle} // Animated bottom spacing driven by menu state
    >
      {/* Search tab: Isolated in its own container for visual separation */}
      <View className="p-1 rounded-full bg-white" style={[styles.buttonBorder, styles.shadow]}>
        <TabButton
          focused={isTabFocused(Tab.Search)}
          onPress={() => navigation.navigate(Tab.Search)}
        >
          <SearchIcon size={22} color={isTabFocused(Tab.Search) ? "#000000" : "#8a8a8a"} />
        </TabButton>
      </View>

      {/* Main tab group: Grouped together for visual cohesion */}
      <View
        className="flex-1 flex-row items-center justify-around py-1 bg-white rounded-full"
        style={[styles.buttonBorder, styles.shadow]}
      >
        <TabButton focused={isTabFocused(Tab.Home)} onPress={() => navigation.navigate(Tab.Home)}>
          <House
            size={22}
            color={isTabFocused(Tab.Home) ? "#000000" : "#8a8a8a"}
            fill={isTabFocused(Tab.Home)}
          />
        </TabButton>

        <TabButton
          focused={isTabFocused(Tab.Orders)}
          onPress={() => navigation.navigate(Tab.Orders)}
        >
          <Inbox
            size={22}
            color={isTabFocused(Tab.Orders) ? "#000000" : "#8a8a8a"}
            fill={isTabFocused(Tab.Orders)}
          />
        </TabButton>

        <TabButton
          focused={isTabFocused(Tab.Products)}
          onPress={() => navigation.navigate(Tab.Products)}
        >
          <Tag
            size={22}
            color={isTabFocused(Tab.Products) ? "#000000" : "#8a8a8a"}
            fill={isTabFocused(Tab.Products)}
          />
        </TabButton>

        {/* Menu trigger: Opens overlay instead of navigating to a screen */}
        <TabButton
          focused={isTabFocused(Tab.Menu)}
          onPress={() => {
            menuProgress.value = 1; // Trigger menu overlay animation
          }}
        >
          <Menu size={22} color={isTabFocused(Tab.Menu) ? "#000000" : "#8a8a8a"} />
        </TabButton>
      </View>

      {/* Profile tab: Isolated in its own container for visual balance with search */}
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

/**
 * Root layout component that provides menu state context and tab navigation
 * MenuProvider wraps the entire tab system to share menuProgress across components
 */
const TabsLayout = () => {
  return (
    <MenuProvider>
      <View className="flex-1 bg-black">
        <View className="flex-1">
          <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: "none" }, // Hide default tab bar for full custom control
              sceneStyle: { backgroundColor: "black" }, // Consistent background for menu transitions
            }}
          >
            <Tabs.Screen name={Tab.Search} />
            <Tabs.Screen name={Tab.Home} />
            <Tabs.Screen name={Tab.Orders} />
            <Tabs.Screen name={Tab.Products} />
            <Tabs.Screen name={Tab.Profile} />
            {/* Note: Tab.Menu is intentionally excluded - it's a UI trigger, not a route */}
          </Tabs>
        </View>
        {/* 
          Menu overlay and close button are rendered at layout level
          This prevents circular dependencies while maintaining shared animation state
        */}
        <MenuOverlay />
      </View>
    </MenuProvider>
  );
};

export default TabsLayout;

// Style constants for consistent appearance across tab elements
const styles = StyleSheet.create({
  buttonBorder: { borderWidth: 1, borderColor: "#F1F1F1" }, // Subtle border for definition
  shadow: {
    // iOS shadow properties for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android elevation equivalent
    elevation: 2,
  },
});

// shopify-menu-transition-animation 🔼
// shopify-custom-bottom-tabs-animation 🔼
