import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";

// apple-invites-welcome-screen-animation 🔽

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  itemKey: string;
  source: number;
};

const ImageBg: FC<Props> = ({ itemKey, source }) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <AnimatedImage
        key={itemKey}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        source={source}
        style={StyleSheet.absoluteFill}
        blurRadius={100}
      />
      <View style={StyleSheet.absoluteFill} className="bg-neutral-800/50" />
    </View>
  );
};

export default memo(ImageBg);

// apple-invites-welcome-screen-animation 🔼
