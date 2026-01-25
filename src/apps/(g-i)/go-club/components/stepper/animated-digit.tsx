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
import { WheelDirection } from "../../lib/types";
import { SPRING_CONFIG_WITH_OVERSHOOT } from "../../lib/constants/daily-steps";

const MAX_BLUR_INTENSITY = 8;

type AnimatedDigitProps = {
  index: number;
  fontSize: number;
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
  wheelDirection: SharedValue<WheelDirection>;
};

export const AnimatedDigit: FC<AnimatedDigitProps> = ({
  index,
  fontSize,
  currentIndex,
  previousIndex,
  wheelDirection,
}) => {
  const paragraph = useMemo(() => {
    return Skia.ParagraphBuilder.Make()
      .pushStyle({
        color: Skia.Color("white"),
        fontSize,
        fontStyle: {
          weight: 700,
        },
      })
      .addText(index.toString())
      .build();
  }, [index, fontSize]);

  const isCurrentDigit = useDerivedValue(() => {
    return currentIndex.get() === index;
  });

  const isPreviousDigit = useDerivedValue(() => {
    return previousIndex.get() === index;
  });

  const animatedProgress = useDerivedValue(() => {
    if (isCurrentDigit.get()) {
      return withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, SPRING_CONFIG_WITH_OVERSHOOT),
      );
    }

    if (isPreviousDigit.get()) {
      return withSpring(0, SPRING_CONFIG_WITH_OVERSHOOT);
    }

    return 0;
  });

  const blurIntensity = useDerivedValue(() => {
    if (wheelDirection.get() === "idle") {
      return 0;
    }

    return interpolate(
      animatedProgress.get(),
      [0, 1],
      [MAX_BLUR_INTENSITY, 0],
      Extrapolation.CLAMP,
    );
  });

  return (
    <Canvas style={{ flex: 1 }}>
      <Group
        layer={
          <Paint>
            <Blur blur={blurIntensity} />
          </Paint>
        }
      >
        <Paragraph paragraph={paragraph} x={2} y={2} width={34} />
      </Group>
    </Canvas>
  );
};
