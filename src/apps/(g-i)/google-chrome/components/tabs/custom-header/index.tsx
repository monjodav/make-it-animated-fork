import React, { FC } from "react";
import { View, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from "./tab-bar";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, withDelay, withTiming } from "react-native-reanimated";
import { useTabsScreenAnimated } from "../../../lib/providers/tabs-screen-animated-provider";

// google-chrome-top-tabs-indicator-animation 🔽
// google-chrome-header-background-animation 🔽

type Props = TabBarProps<string>;

export const CustomHeader: FC<Props> = ({ indexDecimal, onTabPress }) => {
  const insets = useSafeAreaInsets();

  const { offsetY } = useTabsScreenAnimated();

  const rBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(offsetY.value > 0 ? 1 : 0, { duration: 50 }),
    };
  });

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
    <View className="justify-end pb-1.5" style={{ paddingTop: insets.top + 20 }}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          className="bg-neutral-950"
          style={[StyleSheet.absoluteFill, rColorBgStyle]}
        />
        {Platform.OS === "ios" && (
          <Animated.View style={[StyleSheet.absoluteFill, rBlurStyle]}>
            <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        )}
      </View>
      <View className="items-center justify-center">
        <TabBar indexDecimal={indexDecimal} onTabPress={onTabPress} />
        <TouchableOpacity className="absolute left-5" onPress={() => Alert.alert("Search")}>
          <Search size={22} color="lightgray" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// google-chrome-header-background-animation 🔼
// google-chrome-top-tabs-indicator-animation 🔼
