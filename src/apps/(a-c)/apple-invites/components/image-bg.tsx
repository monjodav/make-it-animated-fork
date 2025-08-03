import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";

// apple-invites-welcome-screen-animation 🔽

// createAnimatedComponent wraps expo-image to enable Reanimated transitions
// Required because expo-image isn't natively compatible with Reanimated animations
const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  itemKey: string;
  source: number;
};

const ImageBg: FC<Props> = ({ itemKey, source }) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Key prop forces remount for smooth cross-fade between different background images */}
      <AnimatedImage
        key={itemKey}
        entering={FadeIn.duration(500)} // 500ms fade-in when new background appears
        exiting={FadeOut.duration(500)} // 500ms fade-out when background changes
        source={source}
        style={StyleSheet.absoluteFill}
        blurRadius={100} // Heavy blur creates depth and prevents background from competing with foreground
      />
      {/* Dark overlay ensures content readability and maintains consistent contrast */}
      <View style={StyleSheet.absoluteFill} className="bg-neutral-800/50" />
    </View>
  );
};

export default memo(ImageBg);

// apple-invites-welcome-screen-animation 🔼
