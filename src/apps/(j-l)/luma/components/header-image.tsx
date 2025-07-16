import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { _headerHeight, _headerWidth, _topOffset } from "./header";
import { BlurredImage } from "./blurred-image";
// NOTE: The image must be portrait orientation
import DubaiImage from "@/assets/images/misc/dubai.png";

// luma-blurred-header-image-animation 🔽

type Props = {
  scrollY: SharedValue<number>;
};

export const HeaderImage: FC<Props> = ({ scrollY }) => {
  // Dynamic height for responsive interpolation ranges across device sizes
  const { height } = useWindowDimensions();

  // Parallax animation style combining translateY movement and scale transforms
  const rImageBgStyle = useAnimatedStyle(() => {
    return {
      // Negative offset compensates for status bar space
      top: -_topOffset,
      transform: [
        {
          // Parallax effect: image moves slower than scroll for depth illusion
          // Pull down (-30px): image moves down 30px
          // Normal scroll (0-height): image moves up at 1:1 ratio with scroll
          translateY: interpolate(
            scrollY.value,
            [-_topOffset, 0, height], // Input: pull-down, start, full scroll
            [_topOffset, 0, -height], // Output: move down, neutral, move up
            Extrapolation.CLAMP
          ),
        },
        {
          // Scale animation for dramatic pull-to-zoom effect (iOS bounce)
          // Overscroll creates 2x zoom, returns to normal at scroll start
          scale: interpolate(
            scrollY.value,
            [-height, -_topOffset, 0], // Input: max overscroll, minor pull, normal
            [2, 1, 1], // Output: 200% zoom, normal, normal
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute" // Positioned behind scrollable content
      style={[
        rImageBgStyle,
        // Fixed dimensions prevent layout shifts during animations
        // transformOrigin "top" ensures scaling happens from header top edge
        { width: _headerWidth, height: _headerHeight, transformOrigin: "top" },
      ]}
    >
      <BlurredImage imageSource={DubaiImage} />
    </Animated.View>
  );
};

// luma-blurred-header-image-animation 🔼
