import { ColorPickerPanel } from "../components/color-picker-panel";
import { Header } from "../components/header";
import { sharedConfigs } from "../lib/constants/color-picker-background-animation";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPickerComponent, { ColorFormatsObject, ColorPickerRef } from "reanimated-color-picker";

// colorsapp-color-picker-background-animation 🔽

// Seed color used to initialize both the gradient background and the picker value.
// Sets the first frame to a pleasant, non-black tone to avoid a harsh flash.
const _inputColor = "#F9a8d4";

export default function ColorPicker() {
  const pickerRef = useRef<ColorPickerRef>(null);

  // Single source of truth for the chosen color.
  // SharedValue keeps Header label and background gradient in perfect sync on UI thread.
  const selectedColor = useSharedValue(_inputColor);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Derived gradient stops: top uses the selected color, bottom fades into app background.
  // Using derivedValue ensures Skia receives the updates without re-creating component trees.
  const gradientColors = useDerivedValue(() => {
    return [selectedColor.get(), "#27272a"];
  }, []);

  return (
    <View
      className="flex-1 bg-zinc-800"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {/**
       * Background fill rendered by Skia for GPU-accelerated gradients.
       * Placed absolutely under content; opacity tuned in styles to prevent overpowering UI.
       */}
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          {/** Vertical gradient: top (y=0) -> bottom (y=height). */}
          <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={gradientColors} />
        </Rect>
      </Canvas>
      <ColorPickerComponent
        ref={pickerRef}
        style={styles.colorPicker}
        // Initialize picker state from shared value so thumb matches the background immediately.
        value={selectedColor.get()}
        thumbSize={sharedConfigs.thumbPanelSize}
        // Ring keeps the swatch visible under the thumb for better color confirmation.
        thumbShape="ring"
        onChange={(colors: ColorFormatsObject) => {
          "worklet";
          // Update on UI thread for low-latency feedback in both header and gradient.
          selectedColor.set(colors.hex);
        }}
      >
        <Header inputColor={_inputColor} selectedColor={selectedColor} />
        <ColorPickerPanel />
        <View className="w-[70] h-[70] rounded-full self-center bg-gray-200/10" />
      </ColorPickerComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    // 50% keeps the gradient atmospheric without washing out content.
    opacity: 0.5,
  },
  colorPicker: {
    flex: 1,
  },
});

// colorsapp-color-picker-background-animation 🔼
