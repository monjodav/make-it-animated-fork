import { useDrawerStatus } from "@react-navigation/drawer";
import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { useKeyboardState } from "react-native-keyboard-controller";
import { useEffect } from "react";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { useDrawer } from "@/src/shared/lib/providers/drawer-provider";
import { CameraView } from "@/src/shared/components/index-screen/camera-view";
import { PressToScanBtn } from "@/src/shared/components/index-screen/press-to-scan-btn";
import { IndexAnimationProvider } from "@/src/shared/lib/providers/index-animation";
import { ExploreAnimationsBtn } from "@/src/shared/components/index-screen/explore-animations-btn";
import { OtaUpdate } from "@/src/shared/components/index-screen/ota-update";
import { View } from "react-native";
import { Redirect } from "expo-router";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  useWarmUpBrowser();

  const keyboardStatus = useKeyboardState();
  const drawerStatus = useDrawerStatus();

  const { drawerTextInputRef } = useDrawer();

  useEffect(() => {
    if (keyboardStatus.isVisible && drawerStatus === "closed") {
      drawerTextInputRef.current?.blur();
    }
  }, [keyboardStatus, drawerStatus, drawerTextInputRef]);

  return (
    <IndexAnimationProvider>
      <View className="flex-1 items-center justify-center">
        {/* <CameraView />
        <OtaUpdate />
        <PressToScanBtn />
        <ExploreAnimationsBtn /> */}
        <Redirect href="/(apps)/(p-r)/perplexity/home" />
      </View>
    </IndexAnimationProvider>
  );
}
