import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardController, KeyboardProvider } from "react-native-keyboard-controller";
import { Drawer } from "expo-router/drawer";
import "../global.css";
import Animations from "@/src/shared/components/animations";
import * as Sentry from "@sentry/react-native";
import { VisitWebsite } from "@/src/shared/components/visit-website";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { useVersionCheck } from "@/src/shared/lib/hooks/use-version-check";
import * as Linking from "expo-linking";
import { useOtaUpdate } from "@/src/shared/lib/hooks/use-update";
import { useCallback, useEffect } from "react";
import { DrawerProvider } from "@/src/shared/lib/providers/drawer-provider";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useFonts } from "expo-font";
import { LibreBaskerville_700Bold } from "@expo-google-fonts/libre-baskerville";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

if (!__DEV__) {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID!);

  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  });
}

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

KeyboardController.preload();

const DrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <>
      <Animations {...props} />
      <View className="absolute bottom-0 left-0 right-0">
        <VisitWebsite />
      </View>
    </>
  );
};

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    LibreBaskerville_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useVersionCheck();
  useOtaUpdate();

  const url = Linking.useLinkingURL();

  useEffect(() => {
    if (url && url.includes("miaapp://")) {
      Linking.openURL(url);
    }
  }, [url]);

  const onLayoutRootView = useCallback(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
    if (!__DEV__) {
      setTimeout(() => {
        OneSignal.Notifications.requestPermission(true);
      }, 1000);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardProvider>
        <DrawerProvider>
          <Drawer
            drawerContent={(props: DrawerContentComponentProps) => <DrawerContent {...props} />}
            screenOptions={{
              headerShown: false,
              drawerStyle: {
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
                backgroundColor: "#171717",
              },
            }}
          />
        </DrawerProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
