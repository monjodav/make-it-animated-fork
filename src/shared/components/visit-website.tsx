import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WEBSITE_URL } from "../lib/constants/links";
import { WebBrowserPresentationStyle } from "expo-web-browser";
import { useWarmUpBrowser } from "../lib/hooks/use-warm-up-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLink } from "lucide-react-native";

export const VisitWebsite = () => {
  useWarmUpBrowser();

  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        WebBrowser.openBrowserAsync(WEBSITE_URL, {
          presentationStyle: WebBrowserPresentationStyle.FORM_SHEET,
        })
      }
      className="px-4 pt-4 items-center"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <LinearGradient
        colors={["#1E1E24", "#23232B", "#2C2C36"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="flex-row items-center gap-2">
        <Text className="text-orange-200 font-semibold text-base">Visit the website</Text>
        <ExternalLink size={14} color="#fed7aa" />
      </View>
    </TouchableOpacity>
  );
};
