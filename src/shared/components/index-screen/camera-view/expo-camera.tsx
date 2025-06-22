import { BarcodeScanningResult, CameraView } from "expo-camera";
import React, { FC, useCallback, useMemo, useRef } from "react";
import { Alert, Linking, StyleSheet, useWindowDimensions } from "react-native";
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

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Active box is 80% of screen width, centered
  const boxDimensions = useMemo(() => {
    const boxSize = screenWidth * 0.8;
    const boxLeft = (screenWidth - boxSize) / 2;
    const boxTop = (screenHeight - boxSize) / 2;
    const boxRight = boxLeft + boxSize;
    const boxBottom = boxTop + boxSize;

    return { boxSize, boxLeft, boxTop, boxRight, boxBottom };
  }, [screenWidth, screenHeight]);

  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      if (pathname !== "/") return;

      if (hasHandledScan.current) return;

      // Get barcode bounds
      const { origin, size } = scanningResult.bounds;
      const barcodeLeft = origin.x;
      const barcodeTop = origin.y;
      const barcodeRight = origin.x + size.width;
      const barcodeBottom = origin.y + size.height;

      // Check if barcode is completely inside the active box
      const isInsideBox =
        barcodeLeft >= boxDimensions.boxLeft &&
        barcodeTop >= boxDimensions.boxTop &&
        barcodeRight <= boxDimensions.boxRight &&
        barcodeBottom <= boxDimensions.boxBottom;

      if (!isInsideBox) return;

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
    [pathname, boxDimensions]
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
