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
  // Full screen dimensions for seamless background coverage
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ width, height }}>
      {/* Base crisp image layer */}
      <Image source={imageSource} contentFit="cover" style={{ width, height }} />
      {/* Overlay container for gradient-masked blur effect */}
      <View className="absolute bottom-0" style={{ width, height }}>
        <MaskedView
          maskElement={
            // Gradient mask creates smooth transition from crisp to blurred
            // 0-40%: fully transparent (crisp image shows through)
            // 40-58%: transition zone (18% gradient blend)
            // 58-100%: fully opaque (blurred image visible)
            <LinearGradient
              locations={[0, 0.4, 0.58, 1]} // Precise transition points for natural fade
              colors={["transparent", "transparent", "black", "black"]}
              style={StyleSheet.absoluteFill}
            />
          }
          style={StyleSheet.absoluteFill}
        >
          {/* Heavily blurred duplicate masked by gradient above */}
          <Image
            source={imageSource}
            contentFit="cover"
            style={{ width, height }}
            blurRadius={100} // High blur creates dreamy bottom fade effect
          />
        </MaskedView>
      </View>
    </View>
  );
};

// luma-blurred-header-image-animation 🔼
