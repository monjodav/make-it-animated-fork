import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import "../global.css";
import { Animations } from "@/components/_home/animations";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

const DrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView
      style={{ padding: 0, margin: 0, backgroundColor: "#131316" }}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      <Animations />
    </DrawerContentScrollView>
  );
};

export default function RootLayout() {
  const onLayoutRootView = useCallback(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardProvider>
        <Drawer
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{ headerShown: false }}
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
