import { View, useWindowDimensions, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { Image } from "expo-image";

// luma-blurred-header-image-animation 🔽

type Props = {
  imageSource: number;
};

export const BlurredImage: FC<Props> = ({ imageSource }) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ width, height }}>
      <Image source={imageSource} contentFit="cover" style={{ width, height }} />
      <View className="absolute bottom-0" style={{ width, height }}>
        <MaskedView
          maskElement={
            <LinearGradient
              locations={[0, 0.4, 0.58, 1]}
              colors={["transparent", "transparent", "black", "black"]}
              style={StyleSheet.absoluteFill}
            />
          }
          style={StyleSheet.absoluteFill}
        >
          <Image
            source={imageSource}
            contentFit="cover"
            style={{ width, height }}
            blurRadius={100}
          />
        </MaskedView>
      </View>
    </View>
  );
};

// luma-blurred-header-image-animation 🔼
