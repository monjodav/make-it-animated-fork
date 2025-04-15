import { Pressable, TouchableOpacity } from "react-native";
import Logo from "@/assets/images/icon-ios.png";
import { Image, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { WEBSITE_URL } from "@/src/shared/lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import Animated, { FadeIn } from "react-native-reanimated";
import { updateAlert, useOtaUpdate } from "@/src/shared/lib/hooks/use-update";
import * as Updates from "expo-updates";

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const navigation = useNavigation();

  const { isUpdateAvailable } = useOtaUpdate();

  return (
    <View className="flex-1 items-center justify-center bg-[#131316]">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          WebBrowser.openBrowserAsync(WEBSITE_URL, {
            presentationStyle: WebBrowserPresentationStyle.FORM_SHEET,
          })
        }
      >
        <Image source={Logo} className="size-[100px] opacity-50" />
      </TouchableOpacity>
      <AnimatedTouchable
        entering={FadeIn}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute px-6 py-4 rounded-full items-center self-center bg-stone-200"
        style={{ bottom: insets.bottom + 24 }}
      >
        <Text className="text-stone-900 text-base font-semibold">Explore animations</Text>
      </AnimatedTouchable>
      <View className="absolute left-4 right-4 gap-4" style={{ top: insets.top + 16 }}>
        {isUpdateAvailable && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Updates.reloadAsync()}
            className="p-4 rounded-2xl bg-[#212126] flex-row items-center gap-4"
          >
            <Bell color="gray" strokeWidth={1.5} />
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
