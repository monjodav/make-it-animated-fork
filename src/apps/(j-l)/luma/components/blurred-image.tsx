import { View, useWindowDimensions, StyleSheet, Platform } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";

// luma-blurred-header-image-animation 🔽

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
              locations={[0, 0.4, 0.55, 1]}
              colors={["transparent", "transparent", "black", "black"]}
              style={StyleSheet.absoluteFill}
            />
          }
          style={StyleSheet.absoluteFill}
        >
          <BlurView
            intensity={100}
            tint={Platform.OS === "ios" ? "systemThinMaterial" : "systemUltraThinMaterialDark"}
            style={{ width, height }}
            experimentalBlurMethod="dimezisBlurView"
          />
        </MaskedView>
      </View>
    </View>
  );
};

// luma-blurred-header-image-animation 🔼
