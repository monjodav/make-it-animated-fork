import React, { FC } from "react";
import { Dimensions, Image, View, StyleSheet } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import SkiaBlurImage from "./skia-blur-image";

const screenWidth = Dimensions.get("screen").width;

export const _itemWidth = screenWidth * 0.6;

type Props = {
  index: number;
  imageSrc: number;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
};

export const MarqueeItem: FC<Props> = ({ index, imageSrc, scrollOffsetX, allItemsWidth }) => {
  const shift = (allItemsWidth - screenWidth) / 2;
  const initialLeft = index * _itemWidth - shift;

  const rContainerStyle = useAnimatedStyle(() => {
    const left = ((initialLeft - scrollOffsetX.value) % allItemsWidth) + shift;

    const rotation = interpolate(left, [0, screenWidth - _itemWidth], [-0.5, 0.5]);
    const translateY = interpolate(
      left,
      [0, (screenWidth - _itemWidth) / 2, screenWidth - _itemWidth],
      [1, -0.5, 1]
    );

    return {
      left,
      transform: [{ rotateZ: `${rotation}deg` }, { translateY }],
    };
  });

  return (
    <Animated.View
      className="absolute h-full p-2"
      style={[rContainerStyle, { width: _itemWidth, transformOrigin: "bottom" }]}
    >
      <View className="flex-1 shadow-md">
        <View className="flex-1 rounded-3xl overflow-hidden">
          <Image source={imageSrc} className="h-full w-full" />
          <View className="absolute bottom-0" style={{ width: _itemWidth, height: "100%" }}>
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={[0, 0.4, 0.7, 1]}
                  colors={["transparent", "transparent", "black", "black"]}
                  style={StyleSheet.absoluteFill}
                />
              }
              style={StyleSheet.absoluteFill}
            >
              <SkiaBlurImage imageSrc={imageSrc} />
            </MaskedView>
          </View>
          <View style={StyleSheet.absoluteFill} className="items-center justify-end p-6">
            <View className="bg-white/30 rounded-full h-8 w-1/2 mb-3" />
            <View className="bg-white/20 rounded-full h-5 w-3/4 mb-1" />
            <View className="bg-white/20 rounded-full h-5 w-1/2" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
