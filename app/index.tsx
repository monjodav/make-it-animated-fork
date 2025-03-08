import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Logo from "@/assets/images/icon-ios.png";
import { Image, Text, View } from "react-native";
import { useEffect } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotification } from "@/src/lib/providers/notification-provider";

export default function Index() {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const router = useRouter();

  const { expoPushToken, notification, error } = useNotification();

  useEffect(() => {
    setTimeout(() => {
      // navigation.dispatch(DrawerActions.openDrawer());
      router.push("/github/profile");
    }, 250);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#131316]">
      <Image source={Logo} className="size-20" />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute border border-stone-600 px-4 py-3 rounded-full items-center self-center"
        style={{ bottom: insets.bottom + 10 }}
      >
        <Text className="text-stone-300 text-sm font-semibold">Explore animations</Text>
      </TouchableOpacity>
    </View>
  );
}
