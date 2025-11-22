import * as SplashScreen from "expo-splash-screen";
import { Dimensions, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardController, KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import * as Sentry from "@sentry/react-native";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { useVersionCheck } from "@/src/shared/lib/hooks/use-version-check";
import * as Linking from "expo-linking";
import { useOtaUpdate } from "@/src/shared/lib/hooks/use-update";
import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import { LibreBaskerville_700Bold } from "@expo-google-fonts/libre-baskerville";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { Stack } from "expo-router";

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

const screenHeight = Dimensions.get("window").height;

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    LibreBaskerville_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="animations"
            options={{
              presentation: "formSheet",
              sheetCornerRadius: 32,
              contentStyle: { height: screenHeight * 0.92 },
            }}
          />
        </Stack>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
