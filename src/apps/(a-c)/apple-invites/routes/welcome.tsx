import { View, Pressable, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageOne from "@/assets/images/apple-invites/1.png";
import ImageTwo from "@/assets/images/apple-invites/2.png";
import ImageThree from "@/assets/images/apple-invites/3.png";
import ImageFour from "@/assets/images/apple-invites/4.png";
import ImageFive from "@/assets/images/apple-invites/5.png";
import ImageSix from "@/assets/images/apple-invites/6.png";
import ImageSeven from "@/assets/images/apple-invites/7.png";
import ImageEight from "@/assets/images/apple-invites/8.png";
import { useState } from "react";
import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { Marquee } from "../components/marquee";
import { _itemWidth } from "../components/marquee-item";
import ImageBg from "../components/image-bg";
import useDebounce from "@/src/shared/lib/hooks/use-debounce";

// apple-invites-welcome-screen-animation 🔽

// Static event data for carousel - each event gets its own background image and card
const events = [
  {
    id: 1,
    image: ImageOne,
  },
  {
    id: 2,
    image: ImageTwo,
  },
  {
    id: 3,
    image: ImageThree,
  },
  {
    id: 4,
    image: ImageFour,
  },
  {
    id: 5,
    image: ImageFive,
  },
  {
    id: 6,
    image: ImageSix,
  },
  {
    id: 7,
    image: ImageSeven,
  },
  {
    id: 8,
    image: ImageEight,
  },
];

export default function Welcome() {
  // Track which event card is currently centered/active
  const [activeIndex, setActiveIndex] = useState(0);
  // Debounced version prevents rapid background image changes during fast scrolling
  const [debouncedActiveIndex] = useDebounce(activeIndex, 500);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Shared value for horizontal scroll position - drives all marquee animations
  const scrollOffsetX = useSharedValue(0);
  // Total width needed to display all event cards in sequence
  const allItemsWidth = events.length * _itemWidth;

  // Calculates which card is centered and updates background image accordingly
  useAnimatedReaction(
    () => scrollOffsetX.value,
    (currentValue) => {
      // Normalize to handle infinite scroll wrapping (keeps value within 0 to allItemsWidth)
      const normalizedOffset = ((currentValue % allItemsWidth) + allItemsWidth) % allItemsWidth;
      // Center point offset to determine which card is in the middle of screen
      const shift = width / 2;
      // Calculate which card index is currently centered based on scroll position
      const activeItemIndex = Math.abs(Math.floor((normalizedOffset + shift) / _itemWidth));

      // Handle edge case when scrolling reaches the end
      if (activeItemIndex === events.length) {
        runOnJS(setActiveIndex)(0);
      }

      // Update active index only when it actually changes to avoid unnecessary re-renders
      if (
        activeItemIndex >= 0 &&
        activeItemIndex < events.length &&
        activeItemIndex !== activeIndex
      ) {
        runOnJS(setActiveIndex)(activeItemIndex);
      }
    }
  );

  return (
    <View
      className="flex-1 bg-slate-800"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
    >
      {/* Background image that smoothly transitions as user scrolls through events */}
      <ImageBg
        itemKey={events[debouncedActiveIndex].id.toString()}
        source={events[debouncedActiveIndex].image}
      />
      {/* Marquee takes 60% of screen height and contains scrollable event cards */}
      <View className="basis-[60%] pt-10">
        <Marquee events={events} scrollOffsetX={scrollOffsetX} />
      </View>
      {/* Bottom section with content placeholders and navigation button */}
      <View className="basis-[40%] items-center justify-between pt-12 pb-4">
        {/* Skeleton placeholder content representing event details */}
        <View className="w-full items-center justify-center">
          <View className="w-[60%] h-10 rounded-full bg-white/30 mb-2" />
          <View className="w-[80%] h-10 rounded-full bg-white/30 mb-4" />
          <View className="w-[70%] h-6 rounded-full bg-white/15 mb-2" />
          <View className="w-[30%] h-6 rounded-full bg-white/15" />
        </View>
        {/* Navigation button to manually advance to next event */}
        <Pressable
          className="h-14 rounded-full w-[50%] bg-white/30"
          onPress={() => {
            if (activeIndex < events.length - 1) {
              setActiveIndex(activeIndex + 1);
            } else {
              setActiveIndex(0);
            }
          }}
        />
      </View>
    </View>
  );
}

// apple-invites-welcome-screen-animation 🔼
