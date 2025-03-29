import React, { FC, memo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";

// apple-invites-welcome-screen-animation 🔽

type Props = {
  itemKey: string;
  source: number;
};

const ImageBg: FC<Props> = ({ itemKey, source }) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.Image
        key={itemKey}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        source={source}
        className="h-full w-full"
      />
      <BlurView
        intensity={100}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export default memo(ImageBg);

// apple-invites-welcome-screen-animation 🔼
