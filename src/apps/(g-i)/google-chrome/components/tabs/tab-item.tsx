import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { BlurView } from "expo-blur";

type Props = {
  index: number;
  isActive: boolean;
  activeColor?: string;
};

export const TabItem: FC<Props> = ({ index, isActive, activeColor = "#60a5fa" }) => {
  return (
    <Pressable
      className={cn("h-[220px] basis-1/2", index % 2 === 0 ? "pl-4 pr-2" : "pr-4 pl-2")}
      style={styles.borderCurve}
    >
      {isActive && (
        <Animated.View
          entering={FadeIn}
          className={cn(
            "absolute -top-1 -bottom-1 rounded-[26px]",
            index % 2 === 0 ? "right-1 left-3" : "left-1 right-3"
          )}
          style={[styles.borderCurve, { backgroundColor: activeColor }]}
        />
      )}
      <View className="flex-1 bg-neutral-900 rounded-[24px] border overflow-hidden">
        <View
          className={cn(
            "flex-row items-center gap-3 px-3.5 h-9 ",
            Platform.OS === "android" && "bg-neutral-800"
          )}
        >
          {Platform.OS === "ios" && (
            <BlurView tint="systemUltraThinMaterialDark" style={StyleSheet.absoluteFill} />
          )}
          <View className="w-5 h-5 rounded-full bg-neutral-900/90" />
          <View className="flex-1 h-2 rounded-full bg-neutral-900/75" />
          <Pressable hitSlop={10}>
            <X size={18} color="gray" />
          </Pressable>
        </View>
        <View className="flex-1 bg-neutral-900">{/* Place for image */}</View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
