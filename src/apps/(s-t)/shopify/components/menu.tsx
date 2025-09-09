import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { Settings, X } from "lucide-react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMenu } from "../lib/providers/menu-provider";
import { MOCK_FLAT_LIST_ITEMS } from "../constants/constants";

// shopify-menu-transition-animation 🔽

// Menu items - order matters for animation consistency across screens

export const Menu = () => {
  const insets = useSafeAreaInsets();

  // Shared value that drives all open/close menu transitions
  const { menuProgress } = useMenu();

  // Press animation state for close button
  const isPressed = useSharedValue(false);

  const _renderListItem = ({ item }: { item: (typeof MOCK_FLAT_LIST_ITEMS)[number] }) => (
    <View key={item.title} className="flex-row px-5 py-3 items-center justify-between">
      <View className="flex-row items-center gap-4">
        {item.leftIcon}
        <Text className="text-2xl font-semibold text-[#E5E7EB]">{item.title}</Text>
      </View>
      {item.rightIcon}
    </View>
  );

  /**
   * Container animation:
   * - opacity: fades menu in/out (0→1 with 300ms timing)
   * Both driven by menuProgress (0=closed, 1=open)
   */
  const rContainerStyle = useAnimatedStyle(() => {
    // Fade in/out opacity synced with menu progress
    const opacity = withTiming(interpolate(menuProgress.get(), [0, 1], [0, 1]), { duration: 300 });

    const translateY = withTiming(interpolate(menuProgress.get(), [0, 1], [120, 0]), {
      duration: 300,
    });

    return {
      opacity,
      transform: [
        {
          translateY,
        },
      ],
      pointerEvents: menuProgress.get() === 1 ? "auto" : "none", // Disable interactions when closed
    };
  });

  const rFlatListStyle = useAnimatedStyle(() => {
    const scale = withTiming(interpolate(menuProgress.get(), [0, 1], [0.8, 1]), {
      duration: 300,
    });

    return {
      transform: [
        {
          scale,
        },
      ],
    };
  });

  // Shadow view animation: hide when button is pressed (red)
  const rShadowStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      isPressed.get() ? 0 : 1, // Hide shadow when pressed, show when normal
      { duration: 150 } // Synchronized with button animation
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      className="flex-1 absolute h-full w-full bg-black px-1"
      style={[
        rContainerStyle,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <LinearGradient
        colors={["black", "rgba(0, 0, 0, 0.005)"]}
        start={{ x: 0, y: 0.6 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.topGradient,
          {
            top: insets.top,
          },
        ]}
      >
        <Pressable
          className="p-3 rounded-full"
          onPress={() => menuProgress.set(0)}
          onPressIn={() => {
            isPressed.set(true);
          }}
          onPressOut={() => {
            isPressed.set(false);
          }}
        >
          <Animated.View className="p-3 rounded-full bg-neutral-700">
            <Animated.View
              className="absolute h-10 w-10 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]"
              style={rShadowStyle}
            />
            <X size={20} color="#E5E7EB" />
          </Animated.View>
        </Pressable>
        <View className="flex-row items-center gap-3  bg-neutral-700 px-4 py-3 rounded-full">
          <View className="absolute h-10 w-32 self-center top-1.5 bg-neutral-800 rounded-full shadow-[0_0_6px_#0E0E0E]" />

          <Settings size={20} color="#E5E7EB" />
          <Text className="text-md font-semibold text-[#E5E7EB]">Settings</Text>
        </View>
      </LinearGradient>

      <Animated.View style={rFlatListStyle}>
        <FlatList
          data={MOCK_FLAT_LIST_ITEMS}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={_renderListItem}
          contentContainerStyle={[
            { paddingTop: insets.top + 10, backgroundColor: "black", paddingBottom: 60 },
          ]}
        />
      </Animated.View>

      <LinearGradient
        colors={["rgba(0, 0, 0, 0.005)", "black"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.bottomGradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },
  bottomGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70 },
});

// shopify-menu-transition-animation 🔼
