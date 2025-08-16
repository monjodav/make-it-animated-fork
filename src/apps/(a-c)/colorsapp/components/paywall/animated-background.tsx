import React, { FC, memo, useEffect } from "react";

import {
  Blur,
  Canvas,
  Path,
  processTransform3d,
  Skia,
  usePathValue,
} from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-blurry-background-animation 🔽

// TIMING: Global cycle duration (ms) for scaling blobs
// - 2500ms balances calm motion with responsiveness; kept consistent to simplify phase offsets
const DURATION = 2500;

type Props = {
  lightShadeColor: string;
  accentLightColor: string;
  primaryColor: string;
  accentDarkColor: string;
};

const AnimatedBackground: FC<Props> = ({
  lightShadeColor,
  accentLightColor,
  primaryColor,
  accentDarkColor,
}) => {
  const { width, height } = useWindowDimensions();

  /*---------------------------------------------*
   * TOP
   *---------------------------------------------*/
  // SHAPE: Thin cap across the top edge; uses % of width/height for responsiveness
  const topPathBase = Skia.Path.Make();
  topPathBase.moveTo(0, 0);
  topPathBase.lineTo(0, height * 0.1);
  topPathBase.lineTo(width * 0.2, height * 0.15);
  topPathBase.lineTo(width * 0.8, height * 0.1);
  topPathBase.lineTo(width, 0);
  topPathBase.close();

  const scaleTop = useSharedValue(1);

  const topPath = usePathValue((path) => {
    "worklet";
    // ANIM: UI-thread path transform; scale drives subtle breathing along the top band
    path.transform(processTransform3d([{ scale: scaleTop.value }]));
  }, topPathBase);

  /*---------------------------------------------*
   * MIDDLE
   *---------------------------------------------*/
  // SHAPE: Central amorphous blob; wider footprint to blend primary color under title/content
  const middlePathBase = Skia.Path.Make();
  middlePathBase.moveTo(width, height * 0.1);
  middlePathBase.lineTo(width * 0.3, height * 0.2);
  middlePathBase.lineTo(width * 0.1, height * 0.35);
  middlePathBase.lineTo(width * 0.3, height * 0.38);
  middlePathBase.lineTo(width * 0.6, height * 0.38);
  middlePathBase.lineTo(width * 0.7, height * 0.38);
  middlePathBase.close();

  const scaleMiddle = useSharedValue(1);

  const middlePath = usePathValue((path) => {
    "worklet";
    // ANIM: Scaling creates depth breathing; offset timing prevents uniform pulsing with top blob
    path.transform(processTransform3d([{ scale: scaleMiddle.value }]));
  }, middlePathBase);

  /*---------------------------------------------*
   * BOTTOM RIGHT
   *---------------------------------------------*/
  // SHAPE: Small accent on bottom-right; adds color balance and parallax against middle blob
  const bottomRightPathBase = Skia.Path.Make();
  bottomRightPathBase.moveTo(width, height * 0.15);
  bottomRightPathBase.lineTo(width * 0.75, height * 0.35);
  bottomRightPathBase.lineTo(width, height * 0.39);
  bottomRightPathBase.close();

  const scaleBottomRight = useSharedValue(1);

  const bottomRightPath = usePathValue((path) => {
    "worklet";
    // ANIM: Slightly lower amplitude than others to keep corner motion subtle
    path.transform(processTransform3d([{ scale: scaleBottomRight.value }]));
  }, bottomRightPathBase);

  /*---------------------------------------------*
   * BOTTOM
   *---------------------------------------------*/
  // SHAPE: Wide base blob anchoring the composition at the bottom-left
  const bottomPathBase = Skia.Path.Make();
  bottomPathBase.moveTo(0, height * 0.1);
  bottomPathBase.lineTo(width * 0.2, height * 0.2);
  bottomPathBase.lineTo(width * 0.1, height * 0.3);
  bottomPathBase.lineTo(0, height * 0.35);
  bottomPathBase.close();

  const scaleBottom = useSharedValue(1);

  const bottomPath = usePathValue((path) => {
    "worklet";
    // ANIM: Gentle base breathing to avoid drawing attention away from CTA
    path.transform(processTransform3d([{ scale: scaleBottom.value }]));
  }, bottomPathBase);

  useEffect(() => {
    // TIMELINE & PHASING:
    // - withRepeat(..., -1, true): infinite ping-pong (expand/contract) for natural breathing
    // - Offsets stagger blobs to avoid synchronous pulses and create organic motion
    // RANGES:
    // - Top/Middle: 1.0 → 1.2 (20% growth) noticeable yet soft for large shapes
    // - Bottom/BottomRight: 1.0 → 1.1 (10% growth) to keep peripheral motion subtle
    scaleTop.value = withRepeat(withTiming(1.2, { duration: DURATION }), -1, true);
    scaleMiddle.value = withDelay(
      DURATION / 2,
      withRepeat(withTiming(1.2, { duration: DURATION }), -1, true)
    );
    scaleBottomRight.value = withDelay(
      DURATION,
      withRepeat(withTiming(1.1, { duration: DURATION }), -1, true)
    );
    scaleBottom.value = withRepeat(withTiming(1.1, { duration: DURATION }), -1, true);
  }, []);

  return (
    <Canvas style={styles.canvas}>
      {/* RENDERING: Skia runs on GPU; paths re-render with transformed geometry only (no JS involvement) */}
      {/* BLUR: 60 radius yields soft, glassy glow without visible edges; ordered back-to-front for color blending */}
      <Path path={topPath} color={accentLightColor}>
        <Blur blur={60} />
      </Path>
      <Path path={middlePath} color={primaryColor}>
        <Blur blur={60} />
      </Path>
      <Path path={bottomRightPath} color={lightShadeColor}>
        <Blur blur={60} />
      </Path>
      <Path path={bottomPath} color={accentDarkColor}>
        <Blur blur={60} />
      </Path>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

AnimatedBackground.displayName = "AnimatedBackground";
export default memo(AnimatedBackground);

// colorsapp-blurry-background-animation 🔼
