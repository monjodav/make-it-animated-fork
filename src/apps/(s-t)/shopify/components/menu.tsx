import { FlatList, Text, View } from "react-native";
import React from "react";
import { ChevronDown, Inbox, Settings, X } from "lucide-react-native";
import Animated, { interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMenu } from "../lib/providers/menu-provider";

// shopify-menu-transition-animation 🔽

// Menu items - order matters for animation consistency across screens
const ITEMS = [
  "Home",
  "Orders",
  "Products",
  "Customers",
  "Marketing",
  "Discounts",
  "Content",
  "Markets",
  "Analytics",
] as const;

export const Menu = () => {
  const insets = useSafeAreaInsets();

  // Shared value that drives all open/close menu transitions
  const { menuProgress } = useMenu();

  const _renderListItem = ({ item }: { item: string }) => (
    <View key={item} className="flex-row px-5 py-3 items-center justify-between">
      <View className="flex-row items-center gap-4">
        <Inbox size={20} color="#E5E7EB" />
        <Text className="text-2xl font-semibold text-[#E5E7EB]">{item}</Text>
      </View>
      <ChevronDown size={20} color="#E5E7EB" />
    </View>
  );

  /**
   * Container animation:
   * - opacity: fades menu in/out (0→1 with 300ms timing)
   * - scaleY: slight overscale (1.15→1) for "bounce" effect on open
   * Both driven by menuProgress (0=closed, 1=open)
   */
  const rContainerStyle = useAnimatedStyle(() => {
    // Fade in/out opacity synced with menu progress
    const opacity = withTiming(interpolate(menuProgress.get(), [0, 1], [0, 1]), { duration: 300 });

    // Scale overshoot: starts larger (1.15) then shrinks to natural size (1)
    const scaleY = withTiming(interpolate(menuProgress.get(), [0, 1], [1.15, 1]), {
      duration: 300,
    });

    return {
      opacity,
      transform: [
        {
          scaleY,
        },
      ],
      pointerEvents: menuProgress.get() === 1 ? "auto" : "none", // Disable interactions when closed
    };
  });

  return (
    <Animated.View
      className="flex-1 absolute h-full w-full bg-black px-1"
      style={[
        rContainerStyle,
        {
          // Account for notch/status bar height, prevents clipping on iOS
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <FlatList
        data={ITEMS}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={_renderListItem}
        // Note: Could add scrollEventThrottle optimization if animating on scroll
      />

      {/* Bottom gradient overlay: creates depth separation with footer */}
      <LinearGradient
        colors={["black", "rgba(0, 0, 0, 0.007)"]}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <View className="flex-row items-center justify-between px-8 py-10 ">
          <View className="flex-row py-3 items-center gap-3">
            <Settings size={22} color="#E5E7EB" />
            <Text className="text-2xl font-semibold text-[#E5E7EB]">Settings</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// shopify-menu-transition-animation 🔼
