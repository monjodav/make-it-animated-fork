import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WEBSITE_URL } from "../lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { useWarmUpBrowser } from "../lib/hooks/use-warm-up-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

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
      className="px-4 pt-4 items-center bg-[#131316]"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <View className="flex-row gap-2 items-baseline">
        <Text className="text-pink-300 font-medium text-lg">Get code</Text>
        <AntDesign name="codesquare" size={16} color="#f9a8d4" />
      </View>
      <View className="absolute -top-5 left-0 right-0 h-6">
        <LinearGradient
          colors={[colorKit.setAlpha("#131316", 0.3).hex(), "#131316"]}
          style={StyleSheet.absoluteFill}
          locations={[0, 1]}
        />
      </View>
    </Pressable>
  );
};
