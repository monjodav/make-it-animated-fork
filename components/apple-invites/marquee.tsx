import React, { FC } from "react";
import { useWindowDimensions, View } from "react-native";
import { _itemWidth, MarqueeItem } from "./marquee-item";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const _defaultScrollSpeed = 40; // Units per second

type Props = {
  events: any[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const Marquee: FC<Props> = ({ events, activeIndex, setActiveIndex }) => {
  const { width } = useWindowDimensions();

  const scrollOffsetX = useSharedValue(0);
  const scrollSpeed = useSharedValue(_defaultScrollSpeed);

  const allItemsWidth = events.length * _itemWidth;

  useFrameCallback((frameInfo) => {
    // deltaSeconds is important to handle different device frame rates (30, 60, 120 etc.)
    const deltaSeconds = (frameInfo?.timeSincePreviousFrame ?? 0) / 1000;
    scrollOffsetX.value += scrollSpeed.value * deltaSeconds;
  });

  useAnimatedReaction(
    () => scrollOffsetX.value,
    (currentValue) => {
      const boundedScrollOffsetX = currentValue % allItemsWidth;
      const shift = width / 2;
      const activeItemIndex = Math.floor((boundedScrollOffsetX + shift) / _itemWidth);

      if (
        activeItemIndex >= 0 &&
        activeItemIndex < events.length &&
        activeItemIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(activeItemIndex);
      }
    }
  );

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      scrollSpeed.value = 0;
    })
    .onChange((event) => {
      scrollOffsetX.value -= event.changeX;
    })
    .onFinalize((event) => {
      scrollSpeed.value = -event.velocityX;
      scrollSpeed.value = withTiming(_defaultScrollSpeed, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    });

  return (
    <GestureDetector gesture={gesture}>
      <View className="h-full flex-row gap-3">
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
