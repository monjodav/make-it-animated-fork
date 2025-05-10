import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC, memo } from "react";
import { View, StyleSheet, Pressable, Platform, useWindowDimensions } from "react-native";
import Animated, { FadeIn, LinearTransition, ZoomOut } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { BlurView } from "expo-blur";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  index: number;
  isActive: boolean;
  activeColor?: string;
  onItemPress: () => void;
  onRemovePress?: () => void;
};

const TabItem: FC<Props> = ({
  index,
  isActive,
  activeColor = "#60a5fa",
  onItemPress,
  onRemovePress,
}) => {
  const { width } = useWindowDimensions();

  return (
    <AnimatedPressable
      entering={FadeIn}
      exiting={ZoomOut}
      layout={LinearTransition}
      className={cn("aspect-[0.85] py-2", index % 2 === 0 ? "pl-4 pr-2" : "pr-4 pl-2")}
      style={[styles.borderCurve, { width: width / 2 }]}
      onPress={onItemPress}
    >
      {isActive && (
        <Animated.View
          entering={FadeIn}
          className={cn(
            "absolute top-1 bottom-1 rounded-[26px]",
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
          <Pressable hitSlop={10} onPress={onRemovePress}>
            <X size={18} color="gray" />
          </Pressable>
        </View>
        <View className="flex-1 bg-neutral-900">{/* Place for image */}</View>
      </View>
    </AnimatedPressable>
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

export default memo(TabItem);
