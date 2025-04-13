import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import "../global.css";
import { Animations } from "@/src/shared/components/animations";
import * as NavigationBar from "expo-navigation-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { VisitWebsite } from "@/src/shared/components/visit-website";
import { LogLevel, OneSignal } from "react-native-onesignal";

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

const DrawerContent = (props: DrawerContentComponentProps) => {
  const [query, setQuery] = useState("");

  const insets = useSafeAreaInsets();

  return (
    <>
      <TextInput
        placeholder="Search app..."
        placeholderTextColor="#a8a29e"
        className="bg-[#212126] rounded-xl p-3 text-stone-400 mb-4 mx-4"
        style={{ marginTop: insets.top + 16 }}
        value={query}
        onChangeText={setQuery}
      />
      <ScrollView
        style={{ backgroundColor: "#131316" }}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        <Animations query={query} />
      </ScrollView>
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

        <Drawer
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: "#131316" } }}
        />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
