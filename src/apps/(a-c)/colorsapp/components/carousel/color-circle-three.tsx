import React, { FC, useEffect } from "react";

import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

// Breathing cycle. Keep consistent with other variants for rhythmic cohesion across cards.
const DURATION = 3000;

type Props = {
  primaryColor: string;
};

export const ColorCircleThree: FC<Props> = ({ primaryColor }) => {
  const { width } = useWindowDimensions();

  // Mirror the container size from `CarouselItem` to avoid sampling/aliasing artifacts.
  const WIDTH = width * 0.24;
  const HEIGHT = width * 0.24;

  // Start radii slightly larger than Variant 2 to vary the perceived weight.
  const radiusPrimary = useSharedValue(20);
  const radiusAccentOne = useSharedValue(8);

  useEffect(() => {
    // Offsets: 1s then 2s—keeps beats interleaved with other circles without aligning peaks.
    radiusPrimary.set(
      withDelay(1000, withRepeat(withTiming(30, { duration: DURATION }), -1, true))
    );
    radiusAccentOne.set(
      withDelay(2000, withRepeat(withTiming(16, { duration: DURATION }), -1, true))
    );
  }, []);

  return (
    <Canvas style={styles.canvas}>
      {/* Primary blob bottom-left to contrast other variants' placements. */}
      <Circle cx={WIDTH / 2.5} cy={HEIGHT / 1.5} r={radiusPrimary} color={primaryColor}>
        {/* Slightly stronger blur (15px) for a deeper glow vs neutral accents. */}
        <Blur blur={15} />
      </Circle>
      {/* Accent blob top-right; grows 8→16 to add secondary rhythm. */}
      <Circle cx={WIDTH / 1.5} cy={HEIGHT / 2.5} r={radiusAccentOne} color="#F9A8D4">
        <Blur blur={15} />
      </Circle>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    // Full fill so Skia space matches parent bounds exactly.
    flex: 1,
  },
});

// colorsapp-card-blurry-circles-animation 🔼
