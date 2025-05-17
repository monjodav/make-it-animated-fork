import * as SplashScreen from "expo-splash-screen";
import { Platform, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import "../global.css";
import Animations from "@/src/shared/components/animations";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { VisitWebsite } from "@/src/shared/components/visit-website";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { useVersionCheck } from "@/src/shared/lib/hooks/use-version-check";
import * as Linking from "expo-linking";
import { useOtaUpdate } from "@/src/shared/lib/hooks/use-update";
import { useCallback, useEffect } from "react";
import { DrawerProvider } from "@/src/shared/lib/providers/drawer-provider";

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

const DrawerContent = () => {
  return (
    <>
      <Animations />
      <View className="absolute bottom-0 left-0 right-0">
        <VisitWebsite />
      </View>
    </>
  );
};

export default function RootLayout() {
  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync("black");
  }

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
    setTimeout(() => {
      OneSignal.Notifications.requestPermission(true);
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardProvider>
        {Platform.OS === "android" && (
          <StatusBar style="light" backgroundColor="black" translucent={false} />
        )}
        <DrawerProvider>
          <Drawer
            drawerContent={() => <DrawerContent />}
            screenOptions={{
              headerShown: false,
              drawerStyle: {
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
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
