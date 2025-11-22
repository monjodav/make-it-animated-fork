import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { CameraView } from "@/src/shared/components/index-screen/camera-view";
import { PressToScanBtn } from "@/src/shared/components/index-screen/press-to-scan-btn";
import { IndexAnimationProvider } from "@/src/shared/lib/providers/index-animation";
import { ExploreAnimationsBtn } from "@/src/shared/components/index-screen/explore-animations-btn";
import { OtaUpdate } from "@/src/shared/components/index-screen/ota-update";
import { View } from "react-native";
import { Redirect } from "expo-router";
import { VisitWebsite } from "@/src/shared/components/visit-website";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  useWarmUpBrowser();
  // VS ------------
  // return <Redirect href="/instagram/home" />

  return (
    <IndexAnimationProvider>
      <View className="flex-1 items-center justify-center">
        <CameraView />
        <OtaUpdate />
        <PressToScanBtn />
        <VisitWebsite />
        <ExploreAnimationsBtn />
      </View>
    </IndexAnimationProvider>
  );
}
