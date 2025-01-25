import React, { FC, useEffect } from "react";

import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

const DURATION = 3000;

type Props = {
  primaryColor: string;
};

export const ColorCircleTwo: FC<Props> = ({ primaryColor }) => {
  const { width } = useWindowDimensions();

  const WIDTH = width * 0.24;
  const HEIGHT = width * 0.24;

  const radiusPrimary = useSharedValue(12);
  const radiusAccentOne = useSharedValue(4);
  const radiusAccentTwo = useSharedValue(6);

  useEffect(() => {
    radiusPrimary.value = withDelay(
      500,
      withRepeat(withTiming(30, { duration: DURATION }), -1, true)
    );
    radiusAccentOne.value = withDelay(
      1500,
      withRepeat(withTiming(8, { duration: DURATION }), -1, true)
    );
    radiusAccentTwo.value = withDelay(
      3000,
      withRepeat(withTiming(15, { duration: DURATION }), -1, true)
    );
  }, []);

  return (
    <Canvas style={styles.canvas}>
      <Circle cx={WIDTH / 1.5} cy={HEIGHT / 1.5} r={radiusPrimary} color="#F9A8D4">
        <Blur blur={12} />
      </Circle>
      <Circle cx={WIDTH / 3.5} cy={HEIGHT / 2} r={radiusAccentOne} color="#E5E5E5">
        <Blur blur={12} />
      </Circle>
      <Circle cx={WIDTH / 1.75} cy={HEIGHT / 3.5} r={radiusAccentTwo} color="#F9A8D4">
        <Blur blur={12} />
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
