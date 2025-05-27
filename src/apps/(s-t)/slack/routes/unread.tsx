import React, { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 px-5" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
      <Channel />
      <View className="flex-row gap-5 pt-5">
        <Pressable
          className="flex-1 p-[14px] bg-neutral-900 border border-neutral-700/50 rounded-2xl items-center justify-center"
          style={styles.borderCurve}
        >
          <Text className="text-lg font-semibold text-neutral-300">Keep Unread</Text>
        </Pressable>
        <Pressable
          className="flex-1 p-[14px] bg-emerald-900 border border-emerald-700/50 rounded-2xl items-center justify-center"
          style={styles.borderCurve}
        >
          <Text className="text-lg font-semibold text-neutral-300">Mark as Read</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
