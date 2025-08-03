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

// Each card takes 60% of screen width - ensures cards overlap slightly for continuous feel
export const _itemWidth = screenWidth * 0.6;

type Props = {
  index: number;
  imageSrc: number;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
};

const MarqueeItemComponent: FC<Props> = ({ index, imageSrc, scrollOffsetX, allItemsWidth }) => {
  // Centers the carousel - ensures middle item appears in screen center at scroll position 0
  const shift = (allItemsWidth - screenWidth) / 2;
  // Calculate this item's base position in the infinite scroll sequence
  const initialLeft = index * _itemWidth - shift;

  const rContainerStyle = useAnimatedStyle(() => {
    // Normalize scroll offset to prevent overflow and enable infinite scrolling
    const normalizedOffset =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
    // Calculate this item's current position relative to screen
    const left = ((initialLeft - normalizedOffset) % allItemsWidth) + shift;

    // Create subtle tilt effect: left edge tilts left (-0.6°), right edge tilts right (+0.6°)
    const rotation = interpolate(left, [0, screenWidth - _itemWidth], [-0.6, 0.6]);
    // Vertical parallax: items at edges sit higher, center item sits lower (depth effect)
    const translateY = interpolate(
      left,
      [0, (screenWidth - _itemWidth) / 2, screenWidth - _itemWidth],
      [1, -0.5, 1] // Edge items +1px, center item -0.5px for subtle depth
    );

    return {
      left,
      transform: [{ rotateZ: `${rotation}deg` }, { translateY }],
    };
  });

  return (
    <Animated.View
      className="absolute h-full p-2"
      style={[rContainerStyle, { width: _itemWidth, transformOrigin: "bottom" }]} // Bottom origin makes rotation feel natural
    >
      <View className="flex-1 shadow-md">
        <View className="flex-1 rounded-3xl overflow-hidden">
          {/* Base card image - sharp and clear */}
          <Image source={imageSrc} className="h-full w-full" />
          {/* Glassmorphism effect overlay - creates depth and iOS-style blur */}
          <Animated.View
            entering={FadeIn} // Smooth entrance when card becomes visible
            className="absolute bottom-0"
            style={{ width: _itemWidth, height: "100%" }}
          >
            {/* Gradient mask: transparent top 40%, visible bottom 60% for glass effect */}
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={[0, 0.4, 0.7, 1]} // Gradual transition from transparent to opaque
                  colors={["transparent", "transparent", "black", "black"]}
                  style={StyleSheet.absoluteFillObject}
                />
              }
              style={StyleSheet.absoluteFillObject}
            >
              {/* Duplicate image for blur effect - only bottom portion visible due to mask */}
              <Image source={imageSrc} className="h-full w-full" />
              {/* iOS-style blur overlay - intensity 100 creates strong glassmorphism */}
              <BlurView intensity={100} style={StyleSheet.absoluteFillObject} />
            </MaskedView>
          </Animated.View>
          {/* Content overlay with skeleton placeholders representing event details */}
          <View style={StyleSheet.absoluteFillObject} className="items-center justify-end p-6">
            {/* Event title placeholder - prominent and centered */}
            <View className="bg-white/30 rounded-full h-8 w-1/2 mb-3" />
            {/* Event description placeholders - varying widths for natural text appearance */}
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
