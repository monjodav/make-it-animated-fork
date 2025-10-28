import { StyleSheet, View } from "react-native";
import { interpolateColor, useDerivedValue, type SharedValue } from "react-native-reanimated";
import { Blur, Canvas, RoundedRect } from "@shopify/react-native-skia";

type GradientLayerProps = {
  palette: string[];
  width: number;
  height: number;
  activeIndex: SharedValue<number>;
};

export const BottomGlow: React.FC<GradientLayerProps> = ({
  palette,
  width,
  height,
  activeIndex,
}) => {
  const ovalWidth = width * 1.2;
  const ovalHeight = Math.max(160, height * 0.3);
  const ovalX = (width - ovalWidth) / 2;
  const ovalY = height * 0.84;

  const fillColor = useDerivedValue(() => {
    const inputs = palette.map((_, index) => index);
    const color = interpolateColor(activeIndex.get(), inputs, palette, "HSV");
    return color;
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        <RoundedRect
          x={ovalX}
          y={ovalY}
          width={ovalWidth}
          height={ovalHeight}
          r={ovalHeight / 2}
          color={fillColor}
        >
          <Blur blur={60} />
        </RoundedRect>
      </Canvas>
    </View>
  );
};
