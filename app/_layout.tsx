import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import "../global.css";
import { Animations } from "@/components/_home/animations";
import * as NavigationBar from "expo-navigation-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationProvider } from "@/src/lib/providers/notification-provider";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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
        placeholderTextColor="#9394a1"
        className="bg-[#212126] rounded-xl p-3 text-[#cccfd5] mb-4 mx-4"
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
  }, []);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <NotificationProvider>
        <KeyboardProvider>
          {Platform.OS === "android" && (
            <StatusBar style="light" backgroundColor="black" translucent={false} />
          )}
          <Drawer
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: "#131316" } }}
          />
        </KeyboardProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
