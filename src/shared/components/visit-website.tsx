import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WEBSITE_URL } from "../lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { useWarmUpBrowser } from "../lib/hooks/use-warm-up-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";

export const VisitWebsite = () => {
  useWarmUpBrowser();

  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() =>
        WebBrowser.openBrowserAsync(`${WEBSITE_URL}/pricing`, {
          presentationStyle: WebBrowserPresentationStyle.FORM_SHEET,
        })
      }
      className="px-4 pt-4 items-center bg-neutral-900"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <View className="flex-row gap-2 items-center">
        <Text className="text-brand font-poppins-medium text-lg">Get code</Text>
        <View className="size-4 rounded-full bg-brand" />
      </View>
      <View className="absolute -top-9 left-0 right-0 h-10 pointer-events-none">
        <LinearGradient
          colors={[colorKit.setAlpha("#171717", 0).hex(), "#171717"]}
          style={StyleSheet.absoluteFill}
          locations={[0, 1]}
        />
      </View>
    </Pressable>
  );
};
