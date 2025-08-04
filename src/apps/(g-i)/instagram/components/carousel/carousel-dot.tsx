import React, { type FC } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// instagram-pagination-dots-animation 🔽

// Instagram-style dot dimensions: 6px dots with 4px gaps for compact appearance
const DOT_SIZE = 6;
const DOT_GAP = 4;
// Combined width used for scroll position calculations and viewport positioning
const DOT_CONTAINER_WIDTH = DOT_SIZE + DOT_GAP;

interface CarouselDotProps {
  index: number;
  listOffsetX: SharedValue<number>;
  isActive: boolean;
  totalImages: number;
  defaultDotColor: string;
  activeDotColor: string;
}

export const CarouselDot: FC<CarouselDotProps> = ({
  index,
  listOffsetX,
  defaultDotColor,
  isActive,
  totalImages,
  activeDotColor,
}) => {
  // Drives dot scaling animation based on horizontal scroll position within dots list
  const rDotStyle = useAnimatedStyle(() => {
    // Simple mode: no scaling for 5 or fewer images, all dots visible at full size
    if (totalImages < 6) {
      return {
        opacity: 1,
        transform: [
          {
            scale: 1,
          },
        ],
      };
    }

    // Buffer dots: first 2 and last 2 of extended array are hidden but provide smooth transitions
    // These create seamless scale effects at viewport edges for posts with many images
    const hideDot =
      index === 0 || index === 1 || index === totalImages + 2 || index === totalImages + 3;

    // Creates "focus" effect with bell curve scaling across 7-dot viewport
    // Input: dot position relative to scroll offset, Output: scale values for prominence
    const scale = interpolate(
      DOT_CONTAINER_WIDTH * index - listOffsetX.value, // Current dot position in scroll
      [
        0, // Far left edge
        DOT_CONTAINER_WIDTH, // Position 1
        DOT_CONTAINER_WIDTH * 2, // Position 2
        DOT_CONTAINER_WIDTH * 3, // Center (most prominent)
        DOT_CONTAINER_WIDTH * 4, // Position 4
        DOT_CONTAINER_WIDTH * 5, // Position 5
        DOT_CONTAINER_WIDTH * 6, // Far right edge
      ],
      [0.3, 0.7, 1, 1, 1, 0.7, 0.3], // Bell curve: small → large → small
      Extrapolation.CLAMP // Prevents over-scaling beyond defined ranges
    );

    return {
      opacity: hideDot ? 0 : 1, // Hide buffer dots while maintaining layout
      transform: [
        {
          scale, // Apply calculated scale for focus effect
        },
      ],
    };
  });

  return (
    <View className="items-center justify-center" style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.dot,
          rDotStyle,
          { backgroundColor: isActive ? activeDotColor : defaultDotColor },
        ]}
        className="rounded-full"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    width: DOT_CONTAINER_WIDTH,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
  },
});

export { DOT_SIZE, DOT_GAP, DOT_CONTAINER_WIDTH };

// instagram-pagination-dots-animation 🔼
