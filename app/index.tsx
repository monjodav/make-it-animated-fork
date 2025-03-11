import { TouchableOpacity } from "react-native";
import Logo from "@/assets/images/icon-ios.png";
import { Image, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotification } from "@/src/shared/lib/providers/notification-provider";
import { useVersionCheck } from "@/src/shared/lib/hooks/use-version-check";
import { Rocket } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { WEBSITE_URL } from "@/src/shared/lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const navigation = useNavigation();

  const { isUpdateAvailable, linkToStore } = useVersionCheck();

  const { expoPushToken, notification, error } = useNotification();

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
        <Image source={Logo} className="size-20" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute border border-stone-600 px-4 py-3 rounded-full items-center self-center"
        style={{ bottom: insets.bottom + 10 }}
      >
        <Text className="text-stone-300 text-sm font-semibold">Explore animations</Text>
      </TouchableOpacity>
      {isUpdateAvailable && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={linkToStore}
          className="absolute left-4 right-4 p-4 rounded-2xl bg-stone-800 flex-row items-center gap-4"
          style={{ top: insets.top + 16 }}
        >
          <Rocket color="gray" strokeWidth={1.5} />
          <View className="gap-1 flex-1">
            <Text className="text-white text-base">New Version Available</Text>
            <Text className="text-white text-sm font-light">
              Please update the app to get the latest animations and features.{" "}
              <Text className="underline">Download now.</Text>
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
