import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useState, useCallback } from "react";
import { ScrollProvider } from "@/src/apps/(a-c)/app-store/lib/providers/scroll-provider";
import { APP_STORE_CONSTANTS } from "@/src/apps/(a-c)/app-store/lib/constants/animation-config";
import { BlurView } from "expo-blur";

const BLUR_START_OFFSET = APP_STORE_CONSTANTS.BLUR_START_OFFSET;
const BLUR_END_OFFSET = APP_STORE_CONSTANTS.BLUR_END_OFFSET;
const CONTENT_DISAPPEAR_OFFSET = APP_STORE_CONSTANTS.CONTENT_DISAPPEAR_OFFSET;

export default function AppStoreLayout() {
  const router = useRouter();
  const [scrollY, setScrollYState] = useState<SharedValue<number> | null>(null);

  const setScrollY = useCallback((value: SharedValue<number>) => {
    setScrollYState(value);
  }, []);

  const headerBlurStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 0 };

    const opacity = interpolate(
      scrollY.value,
      [BLUR_START_OFFSET, BLUR_END_OFFSET],
      [0.1, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const shouldShowHeaderButtons = useDerivedValue(() => {
    if (!scrollY) return false;

    return scrollY.value >= CONTENT_DISAPPEAR_OFFSET - 30;
  });
  const headerButtonsStyle = useAnimatedStyle(() => {
    const opacity = withTiming(shouldShowHeaderButtons.value ? 1 : 0, {
      duration: 300,
    });

    return { opacity };
  });

  const headerBackground = () => (
    <Animated.View style={[StyleSheet.absoluteFill, headerBlurStyle]}>
      <BlurView
        intensity={75}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      />
    </Animated.View>
  );

  const headerRight = () => (
    <Animated.View
      style={[
        {
          right: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 80,
        },
        headerButtonsStyle,
      ]}
    >
      <View className="h-[30] w-[30] bg-white rounded-[5]" />
      <View className="bg-blue-600 rounded-full px-4 py-1">
        <Text className="text-white text-base font-bold">Open</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollProvider.Provider value={{ scrollY, setScrollY }}>
      <Stack>
        <Stack.Screen
          name="app"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "transparent",
            },
            headerTransparent: true,
            headerBackground: headerBackground,
            headerLeft: () => (
              <Pressable className="flex-row items-center g-2" onPress={router.back}>
                <ChevronLeft size={28} color="#007AFF" />
                <Text className="text-gray-200 text-lg font-bold">Search</Text>
              </Pressable>
            ),
            headerRight: headerRight,
          }}
        />
      </Stack>
    </ScrollProvider.Provider>
  );
}
