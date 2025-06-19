import { BarcodeScanningResult, CameraView } from "expo-camera";
import React, { FC, useCallback, useRef } from "react";
import { Alert, Linking, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { useAppStore } from "../../../lib/store/app";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useDrawerStatus } from "@react-navigation/drawer";

export const ExpoCamera: FC = () => {
  const indexView = useAppStore.use.indexView();
  const pathname = usePathname();
  const drawerStatus = useDrawerStatus();

  const showCamera = pathname === "/" && indexView === "qr" && drawerStatus === "closed";

  const hasHandledScan = useRef(false);

  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      if (pathname !== "/") return;

      if (hasHandledScan.current) return;

      const urlFromCode = scanningResult.data;

      if (!urlFromCode) return;

      hasHandledScan.current = true;

      if (urlFromCode.includes("miaapp://")) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL(urlFromCode);
        setTimeout(() => {
          hasHandledScan.current = false;
        }, 1000);
      } else {
        Alert.alert("Invalid URL", "Please scan a valid QR code from www.makeitanimated.dev.", [
          {
            text: "OK",
            onPress: () => {
              hasHandledScan.current = false;
            },
          },
        ]);
      }
    },
    [pathname]
  );

  if (!showCamera)
    return (
      <Animated.View
        key="no-camera"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={StyleSheet.absoluteFill}
        className="bg-[#131316]"
      />
    );

  return (
    <Animated.View key="camera" exiting={FadeOut.duration(200)} style={StyleSheet.absoluteFill}>
      <CameraView
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
        style={[StyleSheet.absoluteFill, styles.cameraView]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cameraView: {
    backgroundColor: "#131316",
  },
});
