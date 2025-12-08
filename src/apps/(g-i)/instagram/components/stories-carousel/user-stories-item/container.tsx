import React, { FC, PropsWithChildren } from "react";
import { Platform, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { useAnimatedStyle } from "react-native-reanimated";

// instagram-stories-carousel-animation 🔽

// Maximum rotation angle for 3D card flip effect
// Android requires slightly less angle (80°) to prevent visual glitches with perspective transforms
const ANGLE = Platform.OS === "android" ? 80 : 90;

type Props = {
  listAnimatedIndex: SharedValue<number>;
  userIndex: number;
};

export const Container: FC<PropsWithChildren<Props>> = ({
  children,
  listAnimatedIndex,
  userIndex,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // Derives the discrete current index from continuous scroll position
  // Used to determine which card is "active" vs "next" for different animation states
  const listCurrentIndex = useDerivedValue(() => {
    return Math.floor(listAnimatedIndex.get());
  });

  const rContainerStyle = useAnimatedStyle(() => {
    // Progress within current card: 0 (at start) to 1 (at end)
    // Used to drive rotation animation as user swipes between cards
    const progress = listAnimatedIndex.get() - listCurrentIndex.get();

    // Android-specific horizontal translation to prevent clipping during rotation
    // Smoothly shifts card ±8px as it enters/exits view to maintain visual continuity
    const translateX =
      Platform.OS === "android"
        ? interpolate(
            listAnimatedIndex.get(),
            [userIndex - 1, userIndex, userIndex + 1],
            [-8, 0, 8],
            Extrapolation.CLAMP
          )
        : 0;

    // Active card: rotates from 0° to -ANGLE° as user swipes right (next card)
    // Transform origin on right edge creates "flipping away" effect
    if (userIndex === listCurrentIndex.get()) {
      const rotateY = interpolate(progress, [0, 1], [0, -ANGLE], Extrapolation.CLAMP);
      return {
        transformOrigin: "right",
        // Perspective = 4x screen width creates realistic 3D depth perception
        transform: [{ perspective: screenWidth * 4 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    // Next card: rotates from ANGLE° to 0° as it becomes active
    // Transform origin on left edge creates "flipping into view" effect
    if (userIndex === listCurrentIndex.get() + 1) {
      const rotateY = interpolate(progress, [0, 1], [ANGLE, 0], Extrapolation.CLAMP);
      return {
        transformOrigin: "left",
        transform: [{ perspective: screenWidth * 4 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    return {};
  });

  // Animated.View enables Reanimated to apply worklet-based transforms directly on UI thread
  // See: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
  return (
    <Animated.View style={[{ width: screenWidth }, rContainerStyle]}>{children}</Animated.View>
  );
};

// instagram-stories-carousel-animation 🔼
