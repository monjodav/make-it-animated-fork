import { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedReaction,
  type SharedValue,
} from "react-native-reanimated";
import { Canvas, RoundedRect } from "@shopify/react-native-skia";
import { scheduleOnRN } from "react-native-worklets";
import { BlurView } from "expo-blur";

type GradientLayerProps = {
  palette: string[];
  width: number;
  height: number;
  scrollOffsetX: SharedValue<number>;
};

export const GradientLayer: React.FC<GradientLayerProps> = ({
  palette,
  width,
  height,
  scrollOffsetX,
}) => {
  const [fillColor, setFillColor] = useState(palette[0] ?? "#000000");

  useAnimatedReaction(
    () => scrollOffsetX.get(),
    (x) => {
      const inputs = palette.map((_, i) => i * width);
      const c = interpolateColor(x, inputs, palette, "HSV");
      scheduleOnRN(setFillColor, c);
    }
  );

  const ovalWidth = width * 1.2;
  const ovalHeight = Math.max(160, height * 0.3);
  const ovalX = (width - ovalWidth) / 2;
  const ovalY = height * 0.84;

  return (
    <Animated.View style={[StyleSheet.absoluteFill]} pointerEvents="none">
      <BlurView
        tint="systemUltraThinMaterialDark"
        pointerEvents="none"
        intensity={80}
        style={[
          StyleSheet.absoluteFill,
          {
            width: width,
            height: "100%",
            zIndex: 1,
          },
        ]}
      />
      <Canvas style={StyleSheet.absoluteFill}>
        <RoundedRect
          x={ovalX}
          y={ovalY}
          width={ovalWidth}
          height={ovalHeight}
          r={ovalHeight / 2}
          color={fillColor}
        />
      </Canvas>
    </Animated.View>
  );
};
