import React, { FC } from "react";
import { Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";
import { Mail, Video } from "lucide-react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";

// gmail-bottom-tab-bar-and-fab-animation 🔽

// Animation duration (300ms) provides smooth tab bar hide/show transitions
const _duration = 300;

// Enum for tab types
export enum Tab {
  Inbox = "inbox",
  Meet = "meet",
}

// Custom bottom tab bar with scroll-based hide/show animation
// Coordinates with header animation for unified Gmail UX
export const CustomTabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
  // Get the total height of the tab bar
  const { grossHeight } = useBottomTabBarHeight();

  // Shared animation state from centralized provider
  // Enables coordinated animations between header, tab bar, and FAB
  const { listOffsetY, offsetYAnchorOnBeginDrag, scrollDirection } = useAnimatedScrollList();

  // Tab bar animation style - hides when scrolling down, shows when scrolling up
  const rContainerStyle = useAnimatedStyle(() => {
    // Hide condition: scrolled beyond drag start point AND scrolling down
    // Prevents hiding on small scroll movements or direction changes
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      // Move tab bar down by its full height (negative bottom = hidden)
      return {
        bottom: withTiming(-grossHeight, { duration: _duration }),
      };
    }

    // Show condition: any other scroll state (up-scroll or near top)
    // Return tab bar to natural position (bottom: 0)
    return {
      bottom: withTiming(0, { duration: _duration }),
    };
  });

  return (
    // Fixed positioned tab bar with animated bottom offset
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-neutral-800 flex-row"
      style={[rContainerStyle, { height: grossHeight }]}
    >
      <Pressable
        className="flex-1 items-center pt-4"
        onPress={() => navigation.navigate(Tab.Inbox)}
        android_ripple={{ color: "transparent" }} // Disable default ripple for custom styling
      >
        <Mail size={20} color={state.index === 0 ? "darksalmon" : "gray"} />
      </Pressable>
      <Pressable
        className="flex-1 items-center pt-4"
        onPress={() => navigation.navigate(Tab.Meet)}
        android_ripple={{ color: "transparent" }}
      >
        <Video size={20} color={state.index === 1 ? "darksalmon" : "gray"} />
      </Pressable>
    </Animated.View>
  );
};

// gmail-bottom-tab-bar-and-fab-animation 🔼
