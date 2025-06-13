import React, { FC } from "react";
import { View, StyleSheet, Text, useWindowDimensions, Pressable } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { SkiaCorner } from "./skia-corner";

export const CameraView: FC = () => {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      console.log(codes);
    },
  });

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const _innerRectWidth = width > 500 ? 400 : width * 0.8;
  const _innerRectHeight = _innerRectWidth;

  const outer = rrect(rect(0, 0, width, height), 25, 25);
  const inner = rrect(
    rect(
      (width - _innerRectWidth) / 2,
      (height - _innerRectHeight) / 2,
      _innerRectWidth,
      _innerRectHeight
    ),
    32,
    32
  );

  if (hasPermission === false) return <></>;
  if (device === undefined) return <></>;

  return (
    <View className="flex-1" style={[StyleSheet.absoluteFill, styles.container]}>
      <Camera device={device} codeScanner={codeScanner} isActive style={styles.camera} />
      {/* <BlurView style={StyleSheet.absoluteFill} tint="dark" /> */}
      <Canvas style={StyleSheet.absoluteFill}>
        <DiffRect inner={inner} outer={outer} color="rgba(19, 19, 22, 0.5)" />
        {/* Top-left corner */}
        <SkiaCorner
          path={`
            M${(width - _innerRectWidth) / 2},${(height - _innerRectHeight) / 2 + 42}
            v-10
            a32,32 0 0 1 32,-32
            h10
          `}
        />
        {/* Top-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2 - 42},${(height - _innerRectHeight) / 2}
            h10
            a32,32 0 0 1 32,32
            v10`}
        />
        {/* Bottom-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2},${(height + _innerRectHeight) / 2 - 42}
            v10
            a32,32 0 0 1 -32,32
            h-10`}
        />
        {/* Bottom-left corner */}
        <SkiaCorner
          path={`M${(width - _innerRectWidth) / 2 + 42},${(height + _innerRectHeight) / 2}
            h-10
            a32,32 0 0 1 -32,-32
            v-10`}
        />
      </Canvas>
      <Pressable className="absolute right-5" style={{ top: insets.top + 20 }}>
        <X size={30} color="white" />
      </Pressable>
      <View className="absolute left-0 right-0 p-4" style={{ bottom: insets.bottom + 20 }}>
        <View className="self-center px-4 py-1 rounded-full bg-lime-100">
          <Text className="text-lime-950 font-semibold">Scan QR code</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
});
