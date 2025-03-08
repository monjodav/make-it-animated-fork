import { PalettePickerPanel } from "../components/palette-picker-panel";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { ArrowLeft } from "lucide-react-native";
import { useRef } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPicker, { ColorPickerRef, returnedResults } from "reanimated-color-picker";

// colorsapp-palette-picker-color-change-animation 🔽

export default function PalettePicker() {
  const pickerRef = useRef<ColorPickerRef>(null);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const state = useSharedValue<"idle" | "active">("idle");

  const lightShadeColor = useSharedValue("#E5E5E5");
  const lightAccentColor = useSharedValue("#F8C2A9");
  const primaryColor = useSharedValue("#F9a8d4");
  const darkAccentColor = useSharedValue("#A5A8F9");
  const darkShadeColor = useSharedValue("#231E2B");

  const linearGradientColors = useDerivedValue(() => {
    return [primaryColor.value, darkShadeColor.value];
  }, []);

  return (
    <View
      className="flex-1 bg-zinc-800"
      style={{
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
        onComplete={() => {
          state.value = "idle";
        }}
        onChange={(colors: returnedResults) => {
          "worklet";
          primaryColor.value = colors.hex;
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
