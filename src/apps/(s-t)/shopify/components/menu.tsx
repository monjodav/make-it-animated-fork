import { FlatList, Pressable, Text, View, StyleSheet, useWindowDimensions } from "react-native";
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

// shopify-menu-transition-animation 🔽

export const Menu = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const translateYDistance = height * 0.15;

  // Shared animation driver (0=closed, 1=open) - coordinates with MenuButton component
  const { menuProgress } = useMenu();

  // Local press state for close button feedback - independent of menu open/close state
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

  const rContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(menuProgress.get(), [0, 1], [0, 1]);

    return {
      opacity,
      pointerEvents: menuProgress.get() === 1 ? "auto" : "none", // Critical: prevents touch conflicts when menu closed
    };
  });

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
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {/* Header */}
      <Animated.View style={rHeaderStyle} className="flex-row items-center justify-between">
        <Pressable
          className="p-3 rounded-full"
          onPress={() => menuProgress.set(withSpring(0, MENU_TRANSITION_SPRING_CONFIG))}
          onPressIn={() => isPressed.set(true)}
          onPressOut={() => isPressed.set(false)}
        >
          <Animated.View className="p-3 rounded-full bg-neutral-700">
            <View className="absolute h-10 w-10 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]" />
            <X size={20} color="#E5E7EB" />
          </Animated.View>
        </Pressable>
        <View className="flex-row items-center gap-3  bg-neutral-700 px-4 py-3 rounded-full">
          <View className="absolute h-10 w-32 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]" />
          <Settings size={20} color="#E5E7EB" />
          <Text className="text-md font-semibold text-[#E5E7EB]">Settings</Text>
        </View>
      </Animated.View>
      {/* Menu */}
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
