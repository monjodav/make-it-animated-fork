import {
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Settings, X } from "lucide-react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMenu } from "../lib/providers/menu-provider";
import { MOCK_FLAT_LIST_ITEMS } from "../lib/constants/menu";
import { MENU_TRANSITION_SPRING_CONFIG } from "../lib/constants/animation-configs";
import { useCallback } from "react";
import * as Haptics from "expo-haptics";

// shopify-menu-transition-animation 🔽

export const Menu = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Motion distance for entry animation (15% of screen height)
  // Rationale: proportional value keeps the slide distance feeling consistent across devices
  // and avoids hard-coded pixels. Small enough to feel snappy, large enough to imply depth.
  const translateYDistance = height * 0.15;

  const { menuProgress } = useMenu();

  // Used for press feedback on the close button. Kept as a shared value so any
  // future visual response can run on the UI thread without a re-render.
  const isPressed = useSharedValue(false);

  const _renderListItem = useCallback(
    ({ item }: { item: (typeof MOCK_FLAT_LIST_ITEMS)[number] }) => (
      <View key={item.title} className="flex-row px-5 py-3 items-center justify-between">
        <View className="flex-row items-center gap-4">
          {item.leftIcon}
          <Text className="text-2xl font-semibold text-[#E5E7EB]">{item.title}</Text>
        </View>
        {item.rightIcon}
      </View>
    ),
    []
  );

  // Container fades in with the menu progress.
  // Interpolation: [0,1] -> opacity [0,1]. We keep it simple to avoid visual lag.
  // Pointer events are toggled at end-state to prevent tapping underlying content during transition.
  // Note: withSpring may briefly overshoot; using equality check here enforces only fully-open menu is interactive.
  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(menuProgress.get(), [0, 1], [0, 1]);

    return {
      opacity,
      pointerEvents: menuProgress.get() === 1 ? "auto" : "none",
    };
  });

  // Header slides up into place.
  // Interpolation: progress [0,1] -> translateY [translateYDistance, 0]
  // Visual intent: content lifts from below to imply a modal sheet overlay rather than a hard cut.
  const rHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(menuProgress.get(), [0, 1], [translateYDistance, 0]);

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  // List content mirrors the header's vertical slide and adds a subtle scale.
  // Interpolations
  // - progress [0,1] -> translateY [translateYDistance, 0]
  // - progress [0,1] -> scale [0.8, 1]
  // The scale-down-at-start implies depth and reduces visual weight during the transition.
  const rFlatListStyle = useAnimatedStyle(() => {
    const translateY = interpolate(menuProgress.get(), [0, 1], [translateYDistance, 0]);

    const scale = interpolate(menuProgress.get(), [0, 1], [0.8, 1]);

    return {
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View
      className="bg-black px-2"
      style={[
        StyleSheet.absoluteFill,
        rContainerStyle,
        {
          // Maintain safe area + slight spacing to keep header controls reachable
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {/* Header */}
      <Animated.View style={rHeaderStyle} className="flex-row items-center justify-between">
        <Pressable
          className="p-3 rounded-full"
          // Close uses spring for a natural deceleration and to stay consistent with the open motion
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            menuProgress.set(withSpring(0, MENU_TRANSITION_SPRING_CONFIG));
          }}
          onPressIn={() => isPressed.set(true)}
          onPressOut={() => isPressed.set(false)}
        >
          <Animated.View className="p-3 rounded-full bg-neutral-700">
            {Platform.OS === "ios" && (
              <View className="absolute h-10 w-10 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]" />
            )}
            <X size={20} color="#E5E7EB" />
          </Animated.View>
        </Pressable>
        <View className="flex-row items-center gap-3  bg-neutral-700 px-4 py-3 rounded-full">
          {Platform.OS === "ios" && (
            <View className="absolute h-10 w-32 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]" />
          )}
          <Settings size={20} color="#E5E7EB" />
          <Text className="text-md font-semibold text-[#E5E7EB]">Settings</Text>
        </View>
      </Animated.View>
      {/* Menu */}
      {/* Matches header translation + scale to read as a single group entering the viewport */}
      <Animated.View style={rFlatListStyle}>
        <FlatList
          data={MOCK_FLAT_LIST_ITEMS}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={_renderListItem}
          contentContainerClassName="pt-3"
        />
      </Animated.View>
    </Animated.View>
  );
};

// shopify-menu-transition-animation 🔼
