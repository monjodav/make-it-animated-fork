import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { Platform, StyleSheet } from "react-native";
import { colorKit } from "reanimated-color-picker";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";

// raycast-home-search-transition-animation 🔽

export const TopGradient: FC = () => {
  const { grossHeight } = useHeaderHeight();

  if (Platform.OS === "android") {
    return (
      <LinearGradient
        style={[StyleSheet.absoluteFillObject, { height: grossHeight * 1.2 }]}
        colors={[colorKit.setAlpha("#171717", 0.9).hex(), colorKit.setAlpha("#171717", 0).hex()]}
        locations={[0.75, 1]}
      />
    );
  }

  return (
    <MaskedView
      maskElement={
        <LinearGradient
          locations={[0.75, 1]}
          colors={["black", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
      }
      style={[StyleSheet.absoluteFill, { height: grossHeight * 1.2 }]}
    >
      <BlurView tint="dark" style={StyleSheet.absoluteFill} />
    </MaskedView>
  );
};

// raycast-home-search-transition-animation 🔼
