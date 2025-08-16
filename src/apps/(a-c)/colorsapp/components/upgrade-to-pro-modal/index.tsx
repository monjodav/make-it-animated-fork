import React, { FC, useCallback, useEffect, useRef } from "react";

import BottomSheet, { BottomSheetBackdropProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import { Backdrop } from "./backdrop";
import { FeatureItem } from "./feature-item";
import PaywallBlurBg from "@/assets/images/misc/paywall-blur-bg.png";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { colorKit } from "reanimated-color-picker";

// colorsapp-upgrade-to-pro-modal-animation 🔽

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const UpgradeToProModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const ref = useRef<BottomSheet>(null);

  useEffect(() => {
    // WHY: Drive sheet open/close from external state to keep animation source-of-truth at route level
    // BottomSheet handles the spring/timing internally; we only toggle imperative methods here
    if (isVisible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    // WHY: Custom backdrop enables branded background + gradient while still binding to sheet's animated index
    (props: BottomSheetBackdropProps) => <Backdrop {...props} />,
    []
  );

  // ANIMATION: Pulsing "Upgrade now" button background
  // - Visual goal: subtle breathing effect to attract attention without being noisy
  // - Timeline: scale 1.2 ↔ 2.0 in a yoyo loop (3s expand + 3s contract)
  // - withRepeat -1: infinite; reverse=true: ping-pong for symmetric motion
  // Note: Worklet runs on UI thread, long durations don't block JS
  const rSubmitBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // Interpolation explained:
          // withSequence(1.0 → 2.0 → 1.2) over 6000ms total, then repeats reversed:
          //  - 1st withTiming: 1.0 → 2.0 (3000ms) = slow expand under blurred image for soft glow
          //  - 2nd withTiming: 2.0 → 1.2 (3000ms) = gentle settle, keeps slight emphasis over 1.0
          scale: withRepeat(
            withSequence(withTiming(2, { duration: 3000 }), withTiming(1.2, { duration: 3000 })),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={[350]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleStyle={styles.handleStyle}
      backgroundStyle={styles.backgroundStyle}
      onClose={() => setIsVisible(false)}
    >
      <LinearGradient
        colors={["transparent", colorKit.setAlpha("#070609", 0.8).hex()]}
        style={StyleSheet.absoluteFill}
      />
      <BottomSheetView style={styles.container}>
        <View className="w-[60] h-[3px] mt-3 rounded-full bg-white/30 self-center" />
        <View className="p-4 pt-8">
          <View className="gap-3 mb-12">
            <FeatureItem text="Unlimited AI color palette generations" />
            <FeatureItem text="Unlimited access to all color instruments" />
            <FeatureItem text="Unlimited access to all testing previews" />
            <FeatureItem text="Access to all upcoming features and updates" />
          </View>
          <TouchableOpacity
            className="p-1 rounded-xl items-center overflow-hidden border-[3px] border-black/20"
            activeOpacity={0.9}
            onPress={simulatePress}
          >
            <Animated.View
              className="absolute top-0 left-0 right-0 bottom-0"
              style={rSubmitBtnStyle}
            >
              <Image source={PaywallBlurBg} style={styles.btnImage} contentFit="cover" />
            </Animated.View>
            <Text className="text-lg font-semibold text-[#070609]" maxFontSizeMultiplier={1.1}>
              Upgrade now
            </Text>
            <Text className="text-sm text-[#231E2B]" maxFontSizeMultiplier={1.1}>
              USD 1.99 / month
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-center mt-4">
            <TouchableOpacity onPress={simulatePress} hitSlop={10}>
              <Text className="text-sm text-white/50" maxFontSizeMultiplier={1.1}>
                Terms of service
              </Text>
            </TouchableOpacity>
            <View className="w-px h-4 bg-white/20 mx-3" />
            <TouchableOpacity onPress={simulatePress} hitSlop={10}>
              <Text className="text-sm text-white/50" maxFontSizeMultiplier={1.1}>
                Restore purchases
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleStyle: {
    display: "none",
  },
  backgroundStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#4C415D",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  btnImage: {
    width: "100%",
    height: "100%",
  },
});

// colorsapp-upgrade-to-pro-modal-animation 🔼
