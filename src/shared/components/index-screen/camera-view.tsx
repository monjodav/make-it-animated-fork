import React, { FC, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Linking,
  Pressable,
  Text,
} from "react-native";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { SkiaCorner } from "./skia-corner";
import { useIndexAnimation } from "../../lib/providers/index-animation";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { CameraView as ExpoCamera, BarcodeScanningResult } from "expo-camera";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const CameraView: FC = () => {
  const hasHandledScan = useRef(false);

  const onBarcodeScanned = useCallback((scanningResult: BarcodeScanningResult) => {
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
  }, []);

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

  const { state } = useIndexAnimation();

  const blurIntensity = useSharedValue(75);

  const backdropAnimatedProps = useAnimatedProps(() => {
    if (state.get() === 1) {
      blurIntensity.set(withSpring(0));
    } else {
      blurIntensity.set(withSpring(75));
    }

    return { intensity: blurIntensity.value };
  });

  const cornerStrokeWidth = useDerivedValue<number>(() => {
    if (state.get() === 1) {
      return withSpring(3);
    }

    return withSpring(0);
  });

  const cornerOpacity = useDerivedValue<number>(() => {
    if (state.get() === 1) {
      return withSpring(1);
    }

    return withSpring(0);
  });

  const rBadgeStyle = useAnimatedStyle(() => {
    if (state.get() === 1) {
      return { opacity: withSpring(1) };
    }

    return { opacity: withSpring(0) };
  });

  const rOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(state.value, [0, 1], [1, 0]),
    };
  });

  return (
    <View className="flex-1" style={[StyleSheet.absoluteFill, styles.container]}>
      <ExpoCamera
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      />
      <AnimatedBlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        animatedProps={backdropAnimatedProps}
        experimentalBlurMethod="dimezisBlurView"
      />
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
          strokeWidth={cornerStrokeWidth}
          opacity={cornerOpacity}
        />
        {/* Top-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2 - 42},${(height - _innerRectHeight) / 2}
            h10
            a32,32 0 0 1 32,32
            v10`}
          strokeWidth={cornerStrokeWidth}
          opacity={cornerOpacity}
        />
        {/* Bottom-right corner */}
        <SkiaCorner
          path={`M${(width + _innerRectWidth) / 2},${(height + _innerRectHeight) / 2 - 42}
            v10
            a32,32 0 0 1 -32,32
            h-10`}
          strokeWidth={cornerStrokeWidth}
          opacity={cornerOpacity}
        />
        {/* Bottom-left corner */}
        <SkiaCorner
          path={`M${(width - _innerRectWidth) / 2 + 42},${(height + _innerRectHeight) / 2}
            h-10
            a32,32 0 0 1 -32,-32
            v-10`}
          strokeWidth={cornerStrokeWidth}
          opacity={cornerOpacity}
        />
      </Canvas>
      <Pressable
        className="absolute right-5"
        style={{ top: insets.top + 20 }}
        onPress={() => state.set(withTiming(0, { duration: 200 }))}
      >
        <X size={30} color="white" />
      </Pressable>
      <Animated.View
        className="absolute left-0 right-0 p-4"
        style={[{ bottom: insets.bottom + 20 }, rBadgeStyle]}
      >
        <View className="self-center px-4 py-1 rounded-full bg-stone-200">
          <Text className="text-stone-900 font-medium">Scan QR code</Text>
        </View>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, rOverlayStyle]} className="bg-[#131316]" />
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
