import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { colorKit } from "reanimated-color-picker";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";

// raycast-home-search-transition-animation 🔽

export const TopGradient: FC = () => {
  const { grossHeight } = useHeaderHeight();

  return (
    <LinearGradient
      style={[StyleSheet.absoluteFillObject, { height: grossHeight }]}
      colors={[colorKit.setAlpha("#171717", 0.9).hex(), colorKit.setAlpha("#171717", 0).hex()]}
      locations={[0.75, 1]}
    />
  );
};

// raycast-home-search-transition-animation 🔼
