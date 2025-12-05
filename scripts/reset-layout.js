#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script resets app/_layout.tsx to a clean state.
 * Can be run independently or as part of reset-project.js
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const layoutTsxContent = `import * as SplashScreen from "expo-splash-screen";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardController, KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import { LibreBaskerville_700Bold } from "@expo-google-fonts/libre-baskerville";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { Bangers_400Regular } from "@expo-google-fonts/bangers/400Regular";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

KeyboardController.preload();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    LibreBaskerville_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Bangers_400Regular,
  });

  const onLayoutRootView = useCallback(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardProvider>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="(apps)" options={{ animation: "slide_from_right" }} />
          <Stack.Screen
            name="qr-scanner"
            options={{
              gestureEnabled: true,
              presentation: "formSheet",
              sheetCornerRadius: 32,
              contentStyle: {
                height: "100%",
              },
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
`;

const resetLayout = async () => {
  try {
    const layoutTsxPath = path.join(root, "app/_layout.tsx");
    
    // Write the clean _layout.tsx content
    await fs.promises.writeFile(layoutTsxPath, layoutTsxContent, "utf8");
    console.log("📝 Reset app/_layout.tsx to clean state.");
  } catch (error) {
    console.error(`❌ Error resetting _layout.tsx: ${error.message}`);
    throw error;
  }
};

// Allow running as standalone script or being imported
if (require.main === module) {
  resetLayout()
    .then(() => {
      console.log("\n✅ Layout reset complete!");
    })
    .catch((error) => {
      console.error(`❌ Error during script execution: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { resetLayout };

