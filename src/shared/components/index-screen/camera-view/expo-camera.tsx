import { BarcodeScanningResult, CameraView } from "expo-camera";
import React, { FC, useCallback, useRef } from "react";
import { Alert, Linking, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { useAppStore } from "../../../lib/store/app";

export const ExpoCamera: FC = () => {
  const indexView = useAppStore.use.indexView();
  const pathname = usePathname();

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

  return (
    <CameraView
      active={pathname === "/" && indexView === "qr"}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={onBarcodeScanned}
      style={StyleSheet.absoluteFill}
    />
  );
};
