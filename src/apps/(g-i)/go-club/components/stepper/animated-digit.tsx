import { FC, useMemo } from "react";
import { Paragraph, Skia, Group, Paint, Blur, Canvas } from "@shopify/react-native-skia";
import {
  useDerivedValue,
  SharedValue,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  mass: 2,
  damping: 14,
  stiffness: 180,
  overshootClamping: true,
};

type AnimatedDigitProps = {
  index: number;
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
};

export const AnimatedDigit: FC<AnimatedDigitProps> = ({ index, currentIndex, previousIndex }) => {
  const paragraph = useMemo(() => {
    return Skia.ParagraphBuilder.Make()
      .pushStyle({
        color: Skia.Color("white"),
        fontSize: 56,
        fontStyle: {
          weight: 700,
        },
      })
      .addText(index.toString())
      .build();
  }, [index]);

  const animatedProgress = useDerivedValue(() => {
    if (currentIndex.get() === index) {
      return withSequence(withTiming(0, { duration: 0 }), withSpring(1, SPRING_CONFIG));
    }

    if (previousIndex.get() === index) {
      return withSpring(0, SPRING_CONFIG);
    }

    return 0;
  });

  const opacity = useDerivedValue(() => {
    return interpolate(animatedProgress.get(), [0, 1], [0, 1]);
  });

  const blurIntensity = useDerivedValue(() => {
    return interpolate(animatedProgress.get(), [0.5, 1], [5, 0], Extrapolation.CLAMP);
  });

  return (
    <Canvas style={{ flex: 1 }}>
      <Group
        layer={
          <Paint opacity={opacity}>
            <Blur blur={blurIntensity} />
          </Paint>
        }
      >
        <Paragraph paragraph={paragraph} x={2} y={2} width={34} />
      </Group>
    </Canvas>
  );
};
