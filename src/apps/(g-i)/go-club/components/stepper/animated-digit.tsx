import { FC, useMemo } from "react";
import { Paragraph, Skia, Group, Paint, Blur, Canvas } from "@shopify/react-native-skia";
import { useDerivedValue, interpolate, Extrapolation, SharedValue } from "react-native-reanimated";

type AnimatedDigitProps = {
  index: number;
  animatedIndex: SharedValue<number>;
};

export const AnimatedDigit: FC<AnimatedDigitProps> = ({ index, animatedIndex }) => {
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

  const opacity = useDerivedValue(() => {
    return interpolate(
      animatedIndex.get(),
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
  });

  const blurIntensity = useDerivedValue(() => {
    return interpolate(
      animatedIndex.get(),
      [index - 0.25, index, index + 0.25],
      [5, 0, 5],
      Extrapolation.CLAMP,
    );
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
