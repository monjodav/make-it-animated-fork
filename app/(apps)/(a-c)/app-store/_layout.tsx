import { Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, StyleSheet, Platform } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import {
  ScrollProvider,
  useScrollContext,
} from "@/src/apps/(a-c)/app-store/lib/providers/scroll-provider";
import { APP_STORE_CONSTANTS } from "@/src/apps/(a-c)/app-store/lib/constants/animation-config";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";
import { Image } from "expo-image";
import AppImage from "@/assets/images/icon-ios.png";
import { cn } from "@/src/shared/lib/utils/cn";

// app-store-header-animation 🔽

// Animation constants pulled from a central config so math stays consistent across screen and header.
// BLUR_* define the scroll range where header background goes from transparent → fully blurred.
// CONTENT_DISAPPEAR_OFFSET marks when large content fades and header buttons fade in.
const BLUR_START_OFFSET = APP_STORE_CONSTANTS.BLUR_START_OFFSET;
const BLUR_END_OFFSET = APP_STORE_CONSTANTS.BLUR_END_OFFSET;
const CONTENT_DISAPPEAR_OFFSET = APP_STORE_CONSTANTS.CONTENT_DISAPPEAR_OFFSET;

const AppStoreStackScreen = () => {
  const { openDrawer } = useDrawerControl();

  const { scrollY } = useScrollContext();

  // Drives header background opacity based on scroll position.
  // Interpolates [BLUR_START_OFFSET..BLUR_END_OFFSET] → [0..1] with CLAMP to avoid overshoot flicker.
  const headerBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.get(),
      [BLUR_START_OFFSET, BLUR_END_OFFSET],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  // Boolean gate to reveal header buttons slightly before content fully disappears.
  // 30px early trigger reduces perceptual lag and avoids a dead zone during fast flings.
  const shouldShowHeaderButtons = useDerivedValue(() => {
    return scrollY.get() >= CONTENT_DISAPPEAR_OFFSET - 30;
  });

  // Smoothly fades in header buttons and slides them up a few pixels for tactile entrance.
  // withTiming defaults are sufficient here; tiny translateY (6) avoids layout jumps.
  const headerButtonsStyle = useAnimatedStyle(() => {
    const opacity = withTiming(shouldShowHeaderButtons.get() ? 1 : 0);
    const translateY = withTiming(shouldShowHeaderButtons.get() ? 0 : 6);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const headerBackground = () => (
    <Animated.View
      className={cn("absolute inset-0", Platform.OS === "android" && "bg-black")}
      // Android: solid color avoids expensive real-time blur; opacity is still animated.
      style={headerBlurStyle}
    >
      {/* iOS: hardware-accelerated blur for native look; gated by animated opacity above. */}
      {Platform.OS === "ios" && <BlurView intensity={75} style={StyleSheet.absoluteFill} />}
    </Animated.View>
  );

  const headerRight = () => (
    <Animated.View
      className="right-2.5 flex-row items-center gap-[90px]"
      style={headerButtonsStyle}
    >
      <Image source={AppImage} style={styles.image} />

      <Pressable className="bg-blue-600 rounded-full px-4 py-1" onPress={simulatePress}>
        <Text className="text-white text-base font-bold">Open</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <Stack>
      <Stack.Screen
        name="app"
        options={{
          title: "",
          // Transparent base lets content scroll under the header so we can draw our own animated BG.
          headerStyle: {
            backgroundColor: "transparent",
          },
          // Critical: keeps React Navigation from painting an opaque header behind our blur.
          headerTransparent: true,
          // Our animated background handles the blur/opacity based on scroll.
          headerBackground: headerBackground,
          headerLeft: () => (
            <Pressable className="flex-row items-center g-2" onPress={openDrawer}>
              <ChevronLeft size={28} color="#007AFF" />
              <Text className="text-[#007AFF] text-xl font-medium">Search</Text>
            </Pressable>
          ),
          headerRight: headerRight,
        }}
      />
    </Stack>
  );
};

export default function AppStoreLayout() {
  return (
    <ScrollProvider>
      <AppStoreStackScreen />
    </ScrollProvider>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderCurve: "continuous",
  },
});

// app-store-header-animation 🔼
