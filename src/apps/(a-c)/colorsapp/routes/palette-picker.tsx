import { PalettePickerPanel } from "../components/palette-picker-panel";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { ArrowLeft } from "lucide-react-native";
import { useRef } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPicker, { ColorFormatsObject, ColorPickerRef } from "reanimated-color-picker";

// colorsapp-palette-picker-color-change-animation 🔽

export default function PalettePicker() {
  const pickerRef = useRef<ColorPickerRef>(null);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Shared UI state used to coordinate panel pulsation (idle) vs tight breathing (active)
  // across components. Updated from touch events inside `ColorPanel`.
  const state = useSharedValue<"idle" | "active">("idle");

  // Core palette shared values. Other components derive hues from these (triadic accents)
  // so updates propagate instantly on the UI thread without React re-renders.
  const lightShadeColor = useSharedValue("#E5E5E5");
  const lightAccentColor = useSharedValue("#F8C2A9");
  const primaryColor = useSharedValue("#F9a8d4");
  const darkAccentColor = useSharedValue("#A5A8F9");
  const darkShadeColor = useSharedValue("#231E2B");

  // Background gradient reacts to primary/dark shade for immediate context feedback
  // while dragging. Derived array avoids object churn on each frame.
  const linearGradientColors = useDerivedValue(() => {
    return [primaryColor.value, darkShadeColor.value];
  }, []);

  return (
    <View
      className="flex-1 bg-zinc-800"
      style={{
        // Insets ensure content doesn't collide with system bars while giving extra
        // space so gradient + animated circles have breathing room.
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={linearGradientColors} />
        </Rect>
      </Canvas>
      <ColorPicker
        ref={pickerRef}
        style={styles.palettePicker}
        value={primaryColor.value}
        // onComplete flips state back to idle for slow breathing loop.
        // Marked as a worklet so it runs on the UI thread with no bridge hops.
        onComplete={() => {
          "worklet";
          state.set("idle");
        }}
        // onChange streams the current color while dragging. Using shared value ensures
        // dependent animations (swatches/gradient) update at 60fps with no React setState.
        onChange={(colors: ColorFormatsObject) => {
          "worklet";
          primaryColor.set(colors.hex);
        }}
      >
        <View className="flex-row items-center justify-between px-4">
          <ArrowLeft size={24} color="white" strokeWidth={1.5} />
          <Text className="text-white text-lg font-medium">Triadic</Text>
          <View className="w-8 h-8 rounded-lg bg-zinc-400/25" />
        </View>
        <PalettePickerPanel
          state={state}
          lightShadeColor={lightShadeColor}
          lightAccentColor={lightAccentColor}
          primaryColor={primaryColor}
          darkAccentColor={darkAccentColor}
          darkShadeColor={darkShadeColor}
        />
        <View className="h-[45px] w-[150px] rounded-full bg-zinc-400/5 self-center mt-9" />
      </ColorPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  palettePicker: {
    flex: 1,
  },
});

// colorsapp-palette-picker-color-change-animation 🔼
