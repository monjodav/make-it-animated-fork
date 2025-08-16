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
    path.transform(processTransform3d([{ scale: scaleTop.value }]));
  }, topPathBase);

  /*---------------------------------------------*
   * MIDDLE
   *---------------------------------------------*/
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
    path.transform(processTransform3d([{ scale: scaleMiddle.value }]));
  }, middlePathBase);

  /*---------------------------------------------*
   * BOTTOM RIGHT
   *---------------------------------------------*/
  const bottomRightPathBase = Skia.Path.Make();
  bottomRightPathBase.moveTo(width, height * 0.15);
  bottomRightPathBase.lineTo(width * 0.75, height * 0.35);
  bottomRightPathBase.lineTo(width, height * 0.39);
  bottomRightPathBase.close();

  const scaleBottomRight = useSharedValue(1);

  const bottomRightPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleBottomRight.value }]));
  }, bottomRightPathBase);

  /*---------------------------------------------*
   * BOTTOM
   *---------------------------------------------*/
  const bottomPathBase = Skia.Path.Make();
  bottomPathBase.moveTo(0, height * 0.1);
  bottomPathBase.lineTo(width * 0.2, height * 0.2);
  bottomPathBase.lineTo(width * 0.1, height * 0.3);
  bottomPathBase.lineTo(0, height * 0.35);
  bottomPathBase.close();

  const scaleBottom = useSharedValue(1);

  const bottomPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleBottom.value }]));
  }, bottomPathBase);

  useEffect(() => {
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
