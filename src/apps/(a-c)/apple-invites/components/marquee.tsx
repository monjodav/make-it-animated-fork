import React, { FC, memo } from "react";
import { View } from "react-native";
import { _itemWidth, MarqueeItem } from "./marquee-item";
import {
  Easing,
  SharedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

// apple-invites-welcome-screen-animation 🔽

const _defaultScrollSpeed = 40; // Auto-scroll velocity in pixels per second for continuous carousel movement

type Props = {
  events: any[];
  scrollOffsetX: SharedValue<number>;
};

const MarqueeComponent: FC<Props> = ({ events, scrollOffsetX }) => {
  // Current scroll velocity - modified by gestures and auto-reset to default
  const scrollSpeed = useSharedValue(_defaultScrollSpeed);

  const allItemsWidth = events.length * _itemWidth;

  // Frame-based animation loop for smooth scrolling across all device refresh rates
  useFrameCallback((frameInfo) => {
    // Convert frame time to seconds - crucial for consistent speed across 60Hz/120Hz displays
    const deltaSeconds = (frameInfo?.timeSincePreviousFrame ?? 0) / 1000;
    // Update scroll position based on current velocity and elapsed time
    scrollOffsetX.value += scrollSpeed.value * deltaSeconds;
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // Stop auto-scroll when user starts dragging
      scrollSpeed.value = 0;
    })
    .onChange((event) => {
      // Apply drag movement directly to scroll position (negative for natural scrolling)
      scrollOffsetX.value -= event.changeX;
    })
    .onFinalize((event) => {
      // Use gesture velocity to create momentum-based scrolling
      scrollSpeed.value = -event.velocityX;
      // Gradually return to auto-scroll speed with smooth easing
      scrollSpeed.value = withTiming(_defaultScrollSpeed, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    });

  return (
    <GestureDetector gesture={gesture}>
      <View className="h-full flex-row ">
        {/* Render all cards simultaneously - positioning handled by individual items */}
        {events.map((event, index) => (
          <MarqueeItem
            key={event.id}
            imageSrc={event.image}
            index={index}
            scrollOffsetX={scrollOffsetX}
            allItemsWidth={allItemsWidth}
          />
        ))}
      </View>
    </GestureDetector>
  );
};

export const Marquee = memo(MarqueeComponent);

// apple-invites-welcome-screen-animation 🔼
