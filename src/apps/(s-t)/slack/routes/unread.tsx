import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { UnreadFooter } from "../components/unread-footer";
import { UnreadHeader } from "../components/unread-header";
import { UnreadDone } from "../components/unread-done";
import { UnreadAnimationProvider } from "../lib/provider/unread-animation";
import { UnreadChannels } from "../components/unread-channels";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <UnreadAnimationProvider>
      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
      >
        <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
        <UnreadHeader />
        <View className="flex-1">
          <UnreadChannels />
          <UnreadFooter />
          <UnreadDone />
        </View>
      </View>
    </UnreadAnimationProvider>
  );
};
