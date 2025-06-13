import { Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell } from "lucide-react-native";
import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import Animated, { FadeIn } from "react-native-reanimated";
import { updateAlert } from "@/src/shared/lib/hooks/use-update";
import * as Updates from "expo-updates";
import { useKeyboardState } from "react-native-keyboard-controller";
import { useEffect } from "react";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { useAppStore } from "@/src/shared/lib/store/app";
import { useDrawer } from "@/src/shared/lib/providers/drawer-provider";
import { CameraView } from "@/src/shared/components/index-screen/camera-view";
import { PressToScanBtn } from "@/src/shared/components/index-screen/press-to-scan-btn";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const navigation = useNavigation();

  const isOtaUpdateAvailable = useAppStore.use.isOtaUpdateAvailable();

  const keyboardStatus = useKeyboardState();
  const drawerStatus = useDrawerStatus();

  const { drawerTextInputRef } = useDrawer();

  useEffect(() => {
    if (keyboardStatus.isVisible && drawerStatus === "closed") {
      drawerTextInputRef.current?.blur();
    }
  }, [keyboardStatus, drawerStatus, drawerTextInputRef]);

  return (
    <View className="flex-1 items-center justify-center bg-[#131316]">
      <PressToScanBtn />
      <CameraView />
      <AnimatedTouchable
        entering={FadeIn}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute bottom-0 px-20 py-5 rounded-full items-center self-center bg-stone-300"
        style={{ bottom: insets.bottom + 24 }}
      >
        <Text className="text-stone-900 text-lg font-semibold">Explore animations</Text>
      </AnimatedTouchable>
      <View className="absolute left-4 right-4 gap-4" style={{ top: insets.top + 16 }}>
        {isOtaUpdateAvailable && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Updates.reloadAsync()}
            className="px-3 py-5 rounded-3xl bg-[#212126] flex-row items-center gap-4"
            style={styles.borderCurve}
          >
            <Bell color="gray" fill="gray" strokeWidth={1.5} />
            <View className="gap-1 flex-1">
              <Text className="text-white text-base">{updateAlert.title}</Text>
              <Text className="text-white text-sm font-light">
                {updateAlert.message}{" "}
                <Text className="underline text-orange-200">Refresh now.</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
