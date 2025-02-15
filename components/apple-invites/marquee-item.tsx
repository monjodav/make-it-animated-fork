import React, { FC, memo } from "react";
import { Dimensions, Image, View, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// apple-invites-welcome-screen-animation 🔽

const screenWidth = Dimensions.get("screen").width;

export const _itemWidth = screenWidth * 0.6;

type Props = {
  index: number;
  imageSrc: number;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
};

const MarqueeItemComponent: FC<Props> = ({ index, imageSrc, scrollOffsetX, allItemsWidth }) => {
  const shift = (allItemsWidth - screenWidth) / 2;
  const initialLeft = index * _itemWidth - shift;

  const rContainerStyle = useAnimatedStyle(() => {
    const normalizedOffset =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
    const left = ((initialLeft - normalizedOffset) % allItemsWidth) + shift;

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
          <Animated.View
            entering={FadeIn}
            className="absolute bottom-0"
            style={{ width: _itemWidth, height: "100%" }}
          >
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={[0, 0.4, 0.7, 1]}
                  colors={["transparent", "transparent", "black", "black"]}
                  style={StyleSheet.absoluteFillObject}
                />
              }
              style={StyleSheet.absoluteFillObject}
            >
              <Image source={imageSrc} className="h-full w-full" />
              <BlurView intensity={100} style={StyleSheet.absoluteFillObject} />
            </MaskedView>
          </Animated.View>
          <View style={StyleSheet.absoluteFillObject} className="items-center justify-end p-6">
            <View className="bg-white/30 rounded-full h-8 w-1/2 mb-3" />
            <View className="bg-white/20 rounded-full h-5 w-3/4 mb-1" />
            <View className="bg-white/20 rounded-full h-5 w-1/2" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const MarqueeItem = memo(MarqueeItemComponent);

// apple-invites-welcome-screen-animation 🔼
