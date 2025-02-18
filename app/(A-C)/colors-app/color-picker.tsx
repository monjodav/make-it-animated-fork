import { ColorPickerPanel } from "@/components/A-C/colors-app/color-picker-panel";
import { Header } from "@/components/A-C/colors-app/header";
import { sharedConfigs } from "@/constants/colors-app/color-picker-background-animation";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPickerComponent, { ColorPickerRef, returnedResults } from "reanimated-color-picker";

// colorsapp-color-picker-background-animation 🔽

const _inputColor = "#F9a8d4";

export default function ColorPicker() {
  const pickerRef = useRef<ColorPickerRef>(null);

  const selectedColor = useSharedValue(_inputColor);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const gradientColors = useDerivedValue(() => {
    return [selectedColor.value, "#27272a"];
  }, []);

  const handleColorChange = (hex: string) => {
    "worklet";
    selectedColor.value = hex;
  };

  return (
    <View
      className="flex-1 bg-zinc-800"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={gradientColors} />
        </Rect>
      </Canvas>
      <ColorPickerComponent
        ref={pickerRef}
        style={styles.colorPicker}
        value={selectedColor.value}
        thumbSize={sharedConfigs.thumbPanelSize}
        thumbShape="ring"
        onChange={(colors: returnedResults) => {
          const hex = colors.hex;
          handleColorChange(hex);
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
    opacity: 0.5,
  },
  colorPicker: {
    flex: 1,
  },
});

// colorsapp-color-picker-background-animation 🔼
