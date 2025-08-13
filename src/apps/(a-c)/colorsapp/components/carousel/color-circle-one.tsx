import React, { FC, useEffect } from "react";

import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

// Breathing cycle length. 3s provides a calm, ambient pulse.
const DURATION = 3000;

type Props = {
  primaryColor: string;
};

export const ColorCircleOne: FC<Props> = ({ primaryColor }) => {
  const { width } = useWindowDimensions();

  // Matches the circular container size from `CarouselItem` for crisp composition.
  const WIDTH = width * 0.24;
  const HEIGHT = width * 0.24;

  // Animated radii act as the only changing state here (keeps GPU cost low).
  const radiusPrimary = useSharedValue(15);
  const radiusAccentOne = useSharedValue(10);

  useEffect(() => {
    // Primary blob: immediate pulse 15→30. Yoyo repeat avoids hard loops.
    radiusPrimary.set(withRepeat(withTiming(30, { duration: DURATION }), -1, true));
    // Secondary blob: delayed by 1s to desynchronize beats and add visual depth.
    radiusAccentOne.set(
      withDelay(1000, withRepeat(withTiming(15, { duration: DURATION }), -1, true))
    );
  }, []);

  return (
    <Canvas style={styles.canvas}>
      {/* Primary blob near top-left; larger blur softens edges for a glassy glow. */}
      <Circle cx={WIDTH / 2.5} cy={HEIGHT / 2.5} r={radiusPrimary} color={primaryColor}>
        {/* 15px blur provides a softer gradient than 12px used in variant 2. */}
        <Blur blur={15} />
      </Circle>
      {/* Neutral accent at bottom-right; smaller pulse to keep focus on primary. */}
      <Circle cx={WIDTH / 1.5} cy={HEIGHT / 1.5} r={radiusAccentOne} color="#E5E5E5">
        <Blur blur={15} />
      </Circle>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    // Full fill so Skia coordinates map 1:1 to parent bounds.
    flex: 1,
  },
});

// colorsapp-card-blurry-circles-animation 🔼
