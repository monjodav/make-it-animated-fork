import React, { FC } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Pressable } from "react-native";
import { ProfileImageBase } from "./profile-image-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  _timingConfig,
  useProfileImageAnimation,
} from "../lib/providers/profile-image-animation-provider";
import { X } from "lucide-react-native";

// threads-profile-picture-animation 🔽

// createAnimatedComponent wraps regular components to make their props directly animatable
// This creates a specialized native worklet-driven variant that optimizes UI thread animations
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AnimatedProfileImage: FC = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const {
    expandedProfileImageSize,
    imageState,
    imageXCoord,
    imageYCoord,
    imageSize,
    blurIntensity,
    closeBtnOpacity,
    open,
    close,
  } = useProfileImageAnimation();

  // Used for pinch/drag gesture feedback - starts at normal scale
  const imageScale = useSharedValue(1);
  // Track starting position for gesture movement calculations
  // These help calculate total distance moved for dismiss threshold
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);

  // Dynamically control touch handling based on animation state
  // Prevents accidental interactions when image is animating or closed
  const rImageContainerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: imageState.value === "open" ? "auto" : "none",
    };
  });

  // Main animated style controlling position, size, and visibility of profile image
  // All values driven by shared values from context for synchronized animations
  const rImageStyle = useAnimatedStyle(() => {
    return {
      left: imageXCoord.value,
      top: imageYCoord.value,
      width: imageSize.value,
      height: imageSize.value,
      // Only visible when open to prevent flickering during transitions
      opacity: imageState.value === "open" ? 1 : 0,
      // Scale provides additional gesture feedback during pan interactions
      transform: [{ scale: imageScale.value }],
    };
  });

  // Animate only blur intensity prop instead of entire component for performance
  // This prevents expensive BlurView re-renders during animation
  const backdropAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: blurIntensity.value,
    };
  });

  // Close button fades in after main animation completes
  // This creates sequential focus - first on image expansion, then on UI controls
  const rCloseBtnStyle = useAnimatedStyle(() => {
    return {
      opacity: closeBtnOpacity.value,
    };
  });

  // Pan gesture handler for dismiss-by-drag interaction pattern
  const pan = Gesture.Pan()
    .onStart(() => {
      // Store initial position to calculate distance moved
      panStartX.value = imageXCoord.value;
      panStartY.value = imageYCoord.value;
      // Hide close button immediately for cleaner gesture UX
      closeBtnOpacity.value = withTiming(0, { duration: 200 });
    })
    .onChange((event) => {
      // Safety check to prevent gesture handling during closing animation
      if (imageState.value === "close") return;

      // Divide movement by 2 for resistance effect - makes gesture feel more weighted
      // This dampening creates a subtle "spring tension" feeling
      imageXCoord.value += event.changeX / 2;
      imageYCoord.value += event.changeY / 2;

      // Calculate total distance moved using Pythagorean theorem
      const deltaX = imageXCoord.value - panStartX.value;
      const deltaY = imageYCoord.value - panStartY.value;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Scale decreases as user drags further - provides visual dismissal feedback
      // Using half screen width as distance threshold matches natural thumb reach
      const scale = interpolate(distance, [0, screenWidth / 2], [1, 0.9], {
        extrapolateRight: "clamp", // Prevents scale from going below 0.9
      });

      // Blur fades out proportionally with distance - strengthens dismissal feedback
      // Same distance threshold keeps animations synchronized
      const blur = interpolate(distance, [0, screenWidth / 2], [100, 0], {
        extrapolateRight: "clamp", // Prevents negative blur values
      });

      imageScale.value = scale;
      blurIntensity.value = blur;
    })
    .onFinalize(() => {
      // Calculate final distance to determine if dismiss threshold was reached
      const deltaX = imageXCoord.value - panStartX.value;
      const deltaY = imageYCoord.value - panStartY.value;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Always reset scale with animation for clean transition
      imageScale.value = withTiming(1, _timingConfig);

      // Dismiss threshold is half of expanded image size - balances
      // accidental dismissal prevention with intentional gesture completion
      if (distance > expandedProfileImageSize / 2) {
        close();
      } else {
        open(); // Re-center if threshold not met
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, rImageContainerStyle]}
        onPress={close}
        className="pointer-events-none"
      >
        {/* Blur is still not so stable on Android. Consider to use backdrop color instead */}
        <AnimatedBlurView
          tint="systemChromeMaterialDark"
          style={StyleSheet.absoluteFill}
          animatedProps={backdropAnimatedProps}
        />
        {/* Position close button safely within the safe area insets */}
        {/* Additional 16px padding provides comfortable touch target spacing */}
        <Animated.View
          className="absolute left-4 bg-black/50 p-1 rounded-full"
          style={[rCloseBtnStyle, { top: insets.top + 16 }]}
        >
          <X size={22} color="white" />
        </Animated.View>
        {/* Center transform origin ensures scaling happens from center point */}
        {/* This creates a natural zoom effect rather than scaling from top-left */}
        <AnimatedPressable
          className="absolute rounded-full overflow-hidden"
          style={[rImageStyle, { transformOrigin: "center" }]}
        >
          <ProfileImageBase />
        </AnimatedPressable>
      </AnimatedPressable>
    </GestureDetector>
  );
};

// threads-profile-picture-animation 🔼
