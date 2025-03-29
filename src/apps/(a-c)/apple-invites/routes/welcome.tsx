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
import { useDebounce } from "use-debounce";
import { _itemWidth } from "../components/marquee-item";
import ImageBg from "../components/image-bg";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";

// apple-invites-welcome-screen-animation 🔽

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
  useAndroidNote(
    "The blur effect may not render properly on Android. Consider using a semi-transparent background instead of blur for better visual consistency."
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [debouncedActiveIndex] = useDebounce(activeIndex, 500);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scrollOffsetX = useSharedValue(0);
  const allItemsWidth = events.length * _itemWidth;

  useAnimatedReaction(
    () => scrollOffsetX.value,
    (currentValue) => {
      const normalizedOffset = ((currentValue % allItemsWidth) + allItemsWidth) % allItemsWidth;
      const shift = width / 2;
      const activeItemIndex = Math.abs(Math.floor((normalizedOffset + shift) / _itemWidth));

      if (activeItemIndex === events.length) {
        runOnJS(setActiveIndex)(0);
      }

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
      <ImageBg
        itemKey={events[debouncedActiveIndex].id.toString()}
        source={events[debouncedActiveIndex].image}
      />
      <View className="basis-[60%] pt-10">
        <Marquee events={events} scrollOffsetX={scrollOffsetX} />
      </View>
      <View className="basis-[40%] items-center justify-between pt-12 pb-4">
        <View className="w-full items-center justify-center">
          <View className="w-[60%] h-10 rounded-full bg-white/30 mb-2" />
          <View className="w-[80%] h-10 rounded-full bg-white/30 mb-4" />
          <View className="w-[70%] h-6 rounded-full bg-white/15 mb-2" />
          <View className="w-[30%] h-6 rounded-full bg-white/15" />
        </View>
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
