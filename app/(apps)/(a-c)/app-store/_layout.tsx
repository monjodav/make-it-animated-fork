import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View, Text, StyleSheet } from "react-native";
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

const BLUR_START_OFFSET = APP_STORE_CONSTANTS.BLUR_START_OFFSET;
const BLUR_END_OFFSET = APP_STORE_CONSTANTS.BLUR_END_OFFSET;
const CONTENT_DISAPPEAR_OFFSET = APP_STORE_CONSTANTS.CONTENT_DISAPPEAR_OFFSET;

const AppStoreStackScreen = () => {
  const router = useRouter();

  const { openDrawer } = useDrawerControl();

  const { scrollY } = useScrollContext();

  const headerBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.get(),
      [BLUR_START_OFFSET, BLUR_END_OFFSET],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const shouldShowHeaderButtons = useDerivedValue(() => {
    return scrollY.get() >= CONTENT_DISAPPEAR_OFFSET - 30;
  });

  const headerButtonsStyle = useAnimatedStyle(() => {
    const opacity = withTiming(shouldShowHeaderButtons.get() ? 1 : 0);
    const translateY = withTiming(shouldShowHeaderButtons.get() ? 0 : 6);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const headerBackground = () => (
    <Animated.View style={[StyleSheet.absoluteFill, headerBlurStyle]}>
      <BlurView
        intensity={75}
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      />
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
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
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
