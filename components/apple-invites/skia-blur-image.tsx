import { Canvas, useImage, Image, Blur } from "@shopify/react-native-skia";
import React, { FC, memo } from "react";
import { useWindowDimensions } from "react-native";

type Props = {
  imageSrc: number;
};

const SkiaBlurImage: FC<Props> = memo(({ imageSrc }) => {
  const { width, height } = useWindowDimensions();
  const image = useImage(imageSrc);

  if (!image) {
    return null;
  }

  return (
    <Canvas style={{ width, height }}>
      <Image x={0} y={0} width={width} height={height} image={image} fit="cover">
        <Blur blur={50} mode="clamp" />
      </Image>
    </Canvas>
  );
});

SkiaBlurImage.displayName = "SkiaBlurImage";

export default SkiaBlurImage;
