import React, { FC } from "react";

import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";

import IconImage from "@/assets/images/apps/colors-app.png";
import PaywallBg from "@/assets/images/misc/paywall-bg.png";
import { LinearGradient } from "expo-linear-gradient";
import { colorKit } from "reanimated-color-picker";

// colorsapp-upgrade-to-pro-modal-animation 🔽

type Props = BottomSheetBackdropProps;

export const Backdrop: FC<Props> = ({ ...props }) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={1}>
      <View className="w-full h-full" style={{ paddingTop: insets.top + 20 }}>
        <Image source={PaywallBg} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={[colorKit.setAlpha("#070609", 0.7).hex(), colorKit.setAlpha("#070609", 0).hex()]}
          style={StyleSheet.absoluteFill}
        />
        <View className="items-center px-4 gap-3">
          <Image source={IconImage} style={styles.iconImage} />
          <Text className="text-3xl text-white">Become a PRO</Text>
        </View>
      </View>
    </BottomSheetBackdrop>
  );
};

const styles = StyleSheet.create({
  iconImage: {
    width: 40,
    height: 40,
    opacity: 0.8,
  },
});

// colorsapp-upgrade-to-pro-modal-animation 🔼
