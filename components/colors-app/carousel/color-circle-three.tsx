import React, { FC, useEffect } from "react";

import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

const DURATION = 3000;

type Props = {
  primaryColor: string;
};

export const ColorCircleThree: FC<Props> = ({ primaryColor }) => {
  const { width } = useWindowDimensions();

  const WIDTH = width * 0.24;
  const HEIGHT = width * 0.24;

  const radiusPrimary = useSharedValue(20);
  const radiusAccentOne = useSharedValue(8);

  useEffect(() => {
    radiusPrimary.value = withDelay(
      1000,
      withRepeat(withTiming(30, { duration: DURATION }), -1, true)
    );
    radiusAccentOne.value = withDelay(
      2000,
      withRepeat(withTiming(16, { duration: DURATION }), -1, true)
    );
  }, []);

  return (
    <Canvas style={styles.canvas}>
      <Circle cx={WIDTH / 2.5} cy={HEIGHT / 1.5} r={radiusPrimary} color={primaryColor}>
        <Blur blur={15} />
      </Circle>
      <Circle cx={WIDTH / 1.5} cy={HEIGHT / 2.5} r={radiusAccentOne} color="#F9A8D4">
        <Blur blur={15} />
      </Circle>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

// colorsapp-card-blurry-circles-animation 🔼
