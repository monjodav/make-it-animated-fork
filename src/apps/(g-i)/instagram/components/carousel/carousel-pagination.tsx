import * as Haptics from "expo-haptics";
import type { FC } from "react";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CarouselDot, DOT_CONTAINER_WIDTH } from "./carousel-dot";
import { useCarousel } from "./carousel-context";
import { colorKit } from "reanimated-color-picker";
import { scheduleOnRN } from "react-native-worklets";

// instagram-pagination-dots-animation 🔽

// Enables Reanimated animations on Pressable for smooth background transitions
// Required for entering/exiting animations and overlay interactions
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Background colors: transparent idle state, subtle white overlay when pressed
const _containerDefaultBgColor = colorKit.setAlpha("#fff", 0).hex(); // Fully transparent
const _containerPressedBgColor = colorKit.setAlpha("#fff", 0.1).hex(); // 10% white overlay

interface CarouselPaginationProps {
  defaultDotColor?: string;
  activeDotColor?: string;
}

export const CarouselPagination: FC<CarouselPaginationProps> = ({
  defaultDotColor = "#525252",
  activeDotColor = "#3b82f6",
}) => {
  const {
    images,
    currentIndex,
    setCurrentIndex,
    carouselRef,
    dotsListRef,
    isDotsPressed,
    setIsDotsPressed,
  } = useCarousel();

  // Tracks horizontal scroll position of dots list, drives individual dot scale interpolations
  const listOffsetX = useSharedValue(0);

  // Worklet-optimized for UI thread execution at 60fps, updates listOffsetX for smooth dot animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
    },
  });

  // Dynamic sensitivity: 12px for many images, 15px for fewer - prevents accidental swipes when dots are densely packed
  const translateXStep = images.length > 10 ? 12 : 15;
  const prevTranslateX = useSharedValue(0);

  const handleImageIndexChange = (action: "increase" | "decrease") => {
    const index = action === "increase" ? currentIndex + 1 : currentIndex - 1;

    if (index < 0 || index >= images.length) {
      return;
    }

    setCurrentIndex(index);

    // Platform-specific haptics: iOS only to prevent overwhelming Android users
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (index >= 0 && index < images.length) {
      carouselRef.current?.scrollToIndex({
        animated: false,
        index,
      });
    }
  };

  const handleFinalize = () => {
    if (!isDotsPressed) {
      return;
    }

    setIsDotsPressed(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Pan gesture: step-based navigation with delta tracking, only active after long press
  const gesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateX.value = 0; // Reset delta tracking
    })
    .onUpdate((event) => {
      if (!isDotsPressed) {
        return; // Gesture only active during long press state
      }

      const translateX = event.translationX;

      // Step-based navigation prevents rapid firing, includes haptic feedback
      if (translateX - prevTranslateX.value > translateXStep) {
        scheduleOnRN(handleImageIndexChange, "increase");
        prevTranslateX.value = translateX; // Update threshold for next step
      }

      if (translateX - prevTranslateX.value < -translateXStep) {
        scheduleOnRN(handleImageIndexChange, "decrease");
        prevTranslateX.value = translateX; // Update threshold for next step
      }
    })
    .onFinalize(() => {
      scheduleOnRN(handleFinalize); // Exit interaction mode with haptic feedback
    });

  // Smooth background transitions with 150ms timing for responsive feel
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isDotsPressed ? _containerPressedBgColor : _containerDefaultBgColor,
        { duration: 150 } // Fast enough to feel responsive, slow enough to be smooth
      ),
    };
  });

  if (images.length <= 1) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedPressable
        className="bg-white/10 p-2 rounded-full"
        style={[styles.container, rContainerStyle]}
        onLongPress={() => {
          setIsDotsPressed(true); // Enable pan gesture navigation mode
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        delayLongPress={200} // 200ms prevents accidental activation during normal taps
      >
        {/* Container width: fixed 7 dots max for many images prevents pagination from growing too wide */}
        <View
          style={{
            width: DOT_CONTAINER_WIDTH * (images.length > 5 ? 7 : images.length),
          }}
        >
          <Animated.FlatList
            ref={dotsListRef}
            // Extra dots: length + 4 creates smooth scale transitions at edges for posts with many images
            data={Array.from({
              length: images.length > 5 ? images.length + 4 : images.length,
            }).map((_, index) => index)}
            renderItem={({ item }) => (
              <CarouselDot
                index={item}
                listOffsetX={listOffsetX}
                // Active dot offset: +2 accounts for buffer dots in extended array
                isActive={images.length > 5 ? item === currentIndex + 2 : item === currentIndex}
                totalImages={images.length}
                defaultDotColor={defaultDotColor}
                activeDotColor={activeDotColor}
              />
            )}
            horizontal
            scrollEnabled={false} // Controlled programmatically, not by user swipes
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16} // 16ms (~60fps) for smooth dot scale interpolations
          />
        </View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});

// instagram-pagination-dots-animation 🔼
