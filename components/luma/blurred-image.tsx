import { View, useWindowDimensions, Image, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { Canvas, Blur, Image as SkImage, useImage } from "@shopify/react-native-skia";

type SkiaBlurImageProps = {
  imageSource: number;
};

const SkiaBlurImage: FC<SkiaBlurImageProps> = ({ imageSource }) => {
  const { width, height } = useWindowDimensions();
  const image = useImage(imageSource);
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width, height }}>
      <SkImage x={0} y={0} width={width} height={height} image={image} fit="cover">
        <Blur blur={100} mode="clamp" />
      </SkImage>
    </Canvas>
  );
};

type Props = {
  imageSource: number;
};

export const BlurredImage: FC<Props> = ({ imageSource }) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ width, height }}>
      <Image source={imageSource} resizeMode="cover" style={{ width, height }} />
      <View className="absolute bottom-0" style={{ width, height }}>
        <MaskedView
          maskElement={
            <LinearGradient
              locations={[0, 0.3, 0.5, 1]}
              colors={["transparent", "transparent", "black", "black"]}
              style={StyleSheet.absoluteFill}
            />
          }
          style={StyleSheet.absoluteFill}
        >
          <SkiaBlurImage imageSource={imageSource} />
          <View className="absolute w-full h-full bg-black/20" />
        </MaskedView>
      </View>
    </View>
  );
};
