import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import qrCodeAnimation from "@/assets/lottie/qr-code.json";
import Animated, { FadeIn } from "react-native-reanimated";

export const PressToScanBtn: FC = () => {
  return (
    <View className="gap-1.5 items-center">
      <LottieView source={qrCodeAnimation} autoPlay loop={false} style={styles.lottie} />
      <Animated.Text entering={FadeIn.delay(3000)} className="text-stone-200 font-medium text-sm">
        Press to scan
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 90,
    height: 90,
  },
});
