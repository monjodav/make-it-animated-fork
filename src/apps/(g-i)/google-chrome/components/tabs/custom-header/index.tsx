import React, { FC } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from "./tab-bar";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, withDelay, withTiming } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../../lib/providers/tabs-screen-animated-provider";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// google-chrome-top-tabs-indicator-animation 🔽
// google-chrome-header-background-animation 🔽

type Props = TabBarProps<string>;

export const CustomHeader: FC<Props> = ({ indexDecimal, onTabPress }) => {
  const insets = useSafeAreaInsets();

  const { offsetY } = useTabsScreenAnimated();

  // Blur opacity follows scroll offset. We keep this snappy (50ms) so the
  // header reacts immediately on first pixel scroll, matching Chrome's feel.
  const rBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(offsetY.value > 0 ? 1 : 0, { duration: 50 }),
    };
  });

  // Solid color base layer coordinated with blur:
  // - Android: no blur, keep opaque background to ensure contrast
  // - iOS: briefly show solid on scroll start then fade to 0 after 50ms,
  //   allowing BlurView to "settle" and preventing double-darkening.
  const rColorBgStyle = useAnimatedStyle(() => {
    if (Platform.OS === "android") {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: offsetY.value > 0 ? withDelay(50, withTiming(0)) : 1,
    };
  });

  return (
    // Top padding anchors the tab bar below the status bar. +20 creates
    // Chrome-like breathing room around the capsule tab bar.
    <View className="justify-end pb-1.5" style={{ paddingTop: insets.top + 20 }}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          className="bg-neutral-950"
          style={[StyleSheet.absoluteFill, rColorBgStyle]}
        />
        {Platform.OS === "ios" && (
          // iOS system blur for native depth. BlurView requires an animated
          // wrapper (Animated.View) so opacity updates run on the UI thread.
          <Animated.View style={[StyleSheet.absoluteFill, rBlurStyle]}>
            <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        )}
      </View>
      <View className="items-center justify-center">
        {/* Custom TabBar consumes indexDecimal from CollapsibleTabView for
            continuous interpolation between tabs (0→1→2). */}
        <TabBar indexDecimal={indexDecimal} onTabPress={onTabPress} />
        {/* Search icon positioned to mirror Chrome's header layout. */}
        <TouchableOpacity className="absolute left-5" onPress={simulatePress}>
          <Search size={22} color="lightgray" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// google-chrome-header-background-animation 🔼
// google-chrome-top-tabs-indicator-animation 🔼
