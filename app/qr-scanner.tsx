import React from "react";
import { View, StyleSheet, useWindowDimensions, Pressable, Platform } from "react-native";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { Path } from "@shopify/react-native-skia";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { useCallback, useMemo, useRef } from "react";
import { Alert, Linking } from "react-native";
import { fireHaptic } from "@/src/shared/lib/utils/fire-haptic";
import { AppText } from "@/src/shared/components/app-text";

const SkiaCorner: React.FC<{ path: string }> = ({ path }) => {
  return (
    <Path
      path={path}
      color="white"
      style="stroke"
      strokeWidth={3}
      strokeJoin="round"
      strokeCap="round"
      opacity={1}
    />
  );
};

export default function QrScanner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const hasHandledScan = useRef(false);

  const _innerRectWidth = width > 500 ? 400 : width * 0.8;
  const _innerRectHeight = _innerRectWidth;
  const _rectFormSheetCorrection = Platform.OS === "ios" ? insets.top + 12 : 0;
  const _cornerFormSheetCorrection =
    Platform.OS === "ios"
      ? _rectFormSheetCorrection - 6
      : _rectFormSheetCorrection + insets.top - 13;

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      (width - _innerRectWidth) / 2,
      (height - _innerRectHeight - insets.top - _rectFormSheetCorrection) / 2,
      _innerRectWidth,
      _innerRectHeight
    ),
    32,
    32
  );

  // Active box is 80% of screen width, centered
  const boxDimensions = useMemo(() => {
    const boxSize = width * 0.8;
    const boxLeft = (width - boxSize) / 2;
    const boxTop = (height - boxSize) / 2 - _rectFormSheetCorrection;
    const boxRight = boxLeft + boxSize;
    const boxBottom = boxTop + boxSize;

    return { boxSize, boxLeft, boxTop, boxRight, boxBottom };
  }, [width, height, _rectFormSheetCorrection]);

  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
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
        fireHaptic();
        router.back();
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
    [boxDimensions, router]
  );

  return (
    <View className="flex-1 bg-background">
      <CameraView
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
        style={StyleSheet.absoluteFill}
      />
      <Canvas style={StyleSheet.absoluteFill}>
        <DiffRect inner={inner} outer={outer} color="rgba(19, 19, 22, 0.5)" />
        {/* Top-left corner */}
        <SkiaCorner
          path={`
              M${(width - _innerRectWidth) / 2},${(height - _innerRectHeight) / 2 + 42 - _cornerFormSheetCorrection}
              v-10
              a32,32 0 0 1 32,-32
              h10
            `}
        />
        {/* Top-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2 - 42},${(height - _innerRectHeight) / 2 - _cornerFormSheetCorrection}
              h10
              a32,32 0 0 1 32,32
              v10`}
        />
        {/* Bottom-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2},${(height + _innerRectHeight) / 2 - 42 - _cornerFormSheetCorrection}
              v10
              a32,32 0 0 1 -32,32
              h-10`}
        />
        {/* Bottom-left corner */}
        <SkiaCorner
          path={`M${(width - _innerRectWidth) / 2 + 42},${(height + _innerRectHeight) / 2 - _cornerFormSheetCorrection}
              h-10
              a32,32 0 0 1 -32,-32
              v-10`}
        />
      </Canvas>
      <Pressable
        hitSlop={20}
        className="absolute right-5"
        style={{ top: Platform.OS === "ios" ? 20 : insets.top + 20 }}
        onPress={() => {
          router.back();
        }}
      >
        <X size={30} color="white" />
      </Pressable>
      <View className="absolute left-0 right-0 p-4" style={{ bottom: insets.bottom + 20 }}>
        <View className="self-center px-4 py-1 rounded-full bg-neutral-200">
          <AppText className="text-neutral-900 font-sans-medium">Scan QR code</AppText>
        </View>
      </View>
    </View>
  );
}
