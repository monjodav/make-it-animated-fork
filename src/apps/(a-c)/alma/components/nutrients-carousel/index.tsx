import { FC, useEffect, useState, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import CarouselItem from "./carousel-item";
import Animated, { useSharedValue, useDerivedValue, withSpring } from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

// alma-nutrients-circular-carousel-animation 🔽

type Props = {
  slides: NutrientsItem[];
};

const SPRING_CONFIG = {
  damping: 54,
  stiffness: 300,
  mass: 5.5,
};

const ANIMATION_INTERVAL = 2500;

export const NutrientsCarousel: FC<Props> = ({ slides }) => {
  const [extendedSlides, setExtendedSlides] = useState<NutrientsItem[]>(slides);

  const { height: screenHeight } = useWindowDimensions();

  const animatedIndex = useSharedValue(1);

  const currentIndex = useDerivedValue(() => {
    return Math.round(animatedIndex.get());
  });

  const infiniteSlidesLengthRef = useRef(slides.length);

  useEffect(() => {
    setExtendedSlides(slides);
    infiniteSlidesLengthRef.current = slides.length;
  }, [slides]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex.get() + 1;
      const currentExtendedLength = infiniteSlidesLengthRef.current;

      if (nextIndex >= currentExtendedLength - 2) {
        setExtendedSlides((prev) => {
          const newSlides = [...prev, ...slides];
          infiniteSlidesLengthRef.current = newSlides.length;
          return newSlides;
        });
      }

      animatedIndex.set(withSpring(nextIndex, SPRING_CONFIG));
    }, ANIMATION_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [slides, currentIndex, animatedIndex]);

  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <Animated.View className="flex-1 flex-row items-end justify-center">
        {extendedSlides.map((slide, index) => (
          <CarouselItem
            key={`${slide.description}-${index}`}
            index={index}
            slide={slide}
            currentIndex={currentIndex}
            animatedIndex={animatedIndex}
            radius={screenHeight / 2}
          />
        ))}
      </Animated.View>
    </View>
  );
};

// alma-nutrients-circular-carousel-animation 🔼
