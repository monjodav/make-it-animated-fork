import React, { FC, useEffect } from "react";

import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

// Breathing cycle length. 3s feels organic; longer reads calmer, shorter becomes distracting.
const DURATION = 3000;

type Props = {
  primaryColor: string;
};

export const ColorCircleTwo: FC<Props> = ({ primaryColor }) => {
  const { width } = useWindowDimensions();

  // Canvas matches the outer circle container from `CarouselItem` for pixel-perfect alignment.
  // Using width-based ratios keeps layout consistent across devices/orientations.
  const WIDTH = width * 0.24;
  const HEIGHT = width * 0.24;

  // Radii shared values act as our animated state. Small starting values ensure a gentle intro.
  const radiusPrimary = useSharedValue(12);
  const radiusAccentOne = useSharedValue(4);
  const radiusAccentTwo = useSharedValue(6);

  useEffect(() => {
    // Staggered delays prevent synchronized pulses:
    // 0.5s, 1.5s, 3s offsets create a layered shimmer rather than a single beat.
    // withRepeat(..., -1, true) uses yoyo to avoid snapping at loop boundaries.
    radiusPrimary.set(withDelay(500, withRepeat(withTiming(30, { duration: DURATION }), -1, true)));
    radiusAccentOne.set(
      withDelay(1500, withRepeat(withTiming(8, { duration: DURATION }), -1, true))
    );
    radiusAccentTwo.set(
      withDelay(3000, withRepeat(withTiming(15, { duration: DURATION }), -1, true))
    );
  }, []);

  return (
    <Canvas style={styles.canvas}>
      {/* Primary blob: sits bottom-right; grows 12→30 with soft 12px blur for glow. */}
      <Circle cx={WIDTH / 1.5} cy={HEIGHT / 1.5} r={radiusPrimary} color="#F9A8D4">
        {/* Blur softens edges; Skia runs this on GPU so it's affordable on both iOS and Android. */}
        <Blur blur={12} />
      </Circle>
      {/* Highlight speck: small neutral to introduce contrast. */}
      <Circle cx={WIDTH / 3.5} cy={HEIGHT / 2} r={radiusAccentOne} color="#E5E5E5">
        <Blur blur={12} />
      </Circle>
      {/* Accent blob: top-right to balance composition; mid radius range for rhythm. */}
      <Circle cx={WIDTH / 1.75} cy={HEIGHT / 3.5} r={radiusAccentTwo} color="#F9A8D4">
        <Blur blur={12} />
      </Circle>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    // Fill parent so Skia's coordinates match our container bounds.
    flex: 1,
  },
});

// colorsapp-card-blurry-circles-animation 🔼
