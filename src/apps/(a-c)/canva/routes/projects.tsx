import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  HeaderTitle as HeaderTitleComponent,
  HeaderTitleProps,
  useHeaderHeight,
} from "@react-navigation/elements";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ellipsis, Menu, Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";

// canva-header-transition-animation 🔽

export default function Projects() {
  // Native header height from navigation stack - used for layout calculations
  const headerHeight = useHeaderHeight();

  const navigation = useNavigation();

  // Real-time scroll Y position - drives all header transition animations
  const { scrollOffsetY, scrollHandler } = useScrollViewOffset();
  // Dynamic height of the hero section - measured via onLayout for responsive calculations
  const rImageHeaderHeight = useSharedValue(200); // Initial fallback: 200px

  // Scroll-based transition boundaries - calculated from hero section dimensions
  const rInputRange = useDerivedValue(() => {
    // Transition starts at 20% of hero height - early enough to feel responsive
    const start = rImageHeaderHeight.value * 0.2;
    // Transition completes when hero section exits viewport (minus native header)
    const end = rImageHeaderHeight.value - headerHeight;
    return [start, end]; // [startScroll, endScroll] - used across all interpolations
  });

  // Header title visibility - appears only when hero section is fully scrolled out
  const rHeaderTitleContainerStyle = useAnimatedStyle(() => {
    return {
      // Binary transition at end boundary - 0 (hidden) → 1 (visible) with timing animation
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 1 : 0),
    };
  });

  // White icons - visible over hero gradient, hidden when header background appears
  const rWhiteIconStyle = useAnimatedStyle(() => {
    return {
      // Inverse of title opacity - visible when hero is shown, hidden when header is solid
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 0 : 1),
    };
  });

  // Black icons - visible over solid header background for contrast
  const rBlackIconStyle = useAnimatedStyle(() => {
    return {
      // Matches title opacity - appears when header background is solid white
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] ? 1 : 0),
    };
  });

  // Solid header background - appears slightly before other elements for seamless transition
  const rHeaderBackgroundStyle = useAnimatedStyle(() => {
    return {
      // Triggers at 95% of end boundary - ensures background appears before title/icons
      opacity: withTiming(scrollOffsetY.value > rInputRange.value[1] * 0.95 ? 1 : 0),
    };
  });

  // Hero section fade-out - smooth transition from visible to hidden
  const rImageHeaderStyle = useAnimatedStyle(() => {
    return {
      // Linear interpolation: scroll[start→end] maps to opacity[1→0]
      // Creates smooth fade as user scrolls through the transition range
      opacity: interpolate(scrollOffsetY.value, rInputRange.value, [1, 0]),
    };
  });

  // Configure navigation header with animated components - runs once on mount
  useEffect(() => {
    navigation.setOptions({
      // Static menu button - always visible with solid white background
      headerLeft: () => (
        <TouchableOpacity className="p-3 rounded-lg bg-white">
          <Menu size={18} color="black" />
        </TouchableOpacity>
      ),
      // Animated title - fades in when hero section scrolls out of view
      headerTitle: (props: HeaderTitleProps) => {
        return (
          <Animated.View style={rHeaderTitleContainerStyle}>
            <HeaderTitleComponent {...props}>Projects</HeaderTitleComponent>
          </Animated.View>
        );
      },
      // Dual-mode icons - white over hero gradient, black over solid header
      headerRight: () => (
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="items-center justify-center h-5 w-5"
            onPress={() => Alert.alert("Search")}
          >
            {/* Layered icon approach - both versions positioned absolutely for smooth transition */}
            <Animated.View className="absolute" style={rWhiteIconStyle}>
              {/* Thicker stroke for visibility on gradient */}
              <Search size={18} color="white" strokeWidth={2.5} />
            </Animated.View>
            <Animated.View className="absolute" style={rBlackIconStyle}>
              {/* Standard stroke for solid background */}
              <Search size={18} color="black" strokeWidth={2} />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center h-5 w-5"
            onPress={() => Alert.alert("More")}
          >
            {/* Same dual-layer pattern for consistent icon behavior */}
            <Animated.View className="absolute" style={rWhiteIconStyle}>
              {/* Heavier stroke for gradient visibility */}
              <Ellipsis size={18} color="white" strokeWidth={3} />
            </Animated.View>
            <Animated.View className="absolute" style={rBlackIconStyle}>
              <Ellipsis size={18} color="black" strokeWidth={3} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      ),
      // Animated header background - provides contrast for dark icons and title
      headerBackground: () => (
        <Animated.View
          style={[StyleSheet.absoluteFill, rHeaderBackgroundStyle]} // absoluteFill ensures full header coverage
          className="bg-white border-b border-stone-200 " // Solid white with subtle bottom border
        />
      ),
    });
  }, [
    // Dependencies: navigation instance and all animated styles
    // Animated styles are stable (don't change on re-renders) so this effect runs once
    navigation,
    rBlackIconStyle,
    rHeaderBackgroundStyle,
    rHeaderTitleContainerStyle,
    rWhiteIconStyle,
  ]);

  return (
    <View className="flex-1 bg-white">
      {/* Main scroll container - bounces disabled for smoother header transitions */}
      <Animated.ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // 60fps = 16ms
      >
        {/* Hero section - fades out during scroll and measures its own height */}
        <Animated.View
          style={[{ paddingTop: headerHeight }, rImageHeaderStyle]} // paddingTop prevents overlap with native header
          onLayout={(e) => rImageHeaderHeight.set(e.nativeEvent.layout.height)} // Dynamic height measurement for responsive calculations
        >
          {/* Gradient background - dark teal to cyan, diagonal direction for visual depth */}
          <LinearGradient
            colors={["#042f2e", "#22d3ee"]} // Dark teal → Cyan: Canva-inspired color palette
            start={{ x: 0, y: 0 }} // Top-left corner
            end={{ x: 1, y: 1 }} // Bottom-right corner - creates diagonal gradient
            style={StyleSheet.absoluteFill} // Fills entire hero section
          />
          <View className="px-4 py-6">
            <Text className="text-white text-2xl font-bold">Projects</Text>
          </View>
        </Animated.View>
        <View className="p-5 pb-40">
          <View className="flex-row gap-4 mb-8">
            <View className="w-12 h-12 rounded-lg bg-stone-100" />
            <View className="w-[80px] h-12 rounded-lg bg-stone-100" />
            <View className="w-[100px] h-12 rounded-lg bg-stone-100" />
            <View className="w-[100px] h-12 rounded-lg bg-stone-100" />
          </View>
          <View className="w-[150px] h-9 rounded-full bg-stone-100 mb-6" />
          <View className="flex-row gap-4 mb-8">
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
            <View className="w-[110px] aspect-square rounded-xl bg-stone-100" />
          </View>
          <View className="w-[120px] h-9 rounded-full bg-stone-100 mb-6" />
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} className="flex-row gap-4 mb-4 items-center justify-center">
              <View className="w-[48%] aspect-square rounded-xl bg-stone-100" />
              <View className="w-[48%] aspect-square rounded-xl bg-stone-100" />
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// canva-header-transition-animation 🔼
