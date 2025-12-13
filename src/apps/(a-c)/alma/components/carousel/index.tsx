import { FC, useEffect, useState, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import { CarouselItem } from "./carousel-item";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

type Props = {
  slides: NutrientsItem[];
};

/**
 * Spring configuration for smooth carousel transitions
 * Balanced damping and stiffness for natural motion
 */
const SPRING_CONFIG = {
  damping: 32,
  stiffness: 200,
  mass: 2,
};

/**
 * Carousel component with infinite scrolling animation
 *
 * Replaces FlatList with View-based implementation using translateX animation.
 * Automatically advances every 2000ms with spring animation.
 * Scrolls infinitely in one direction by dynamically extending the array when approaching the end.
 */
export const Carousel: FC<Props> = ({ slides }) => {
  const [extendedSlides, setExtendedSlides] = useState<NutrientsItem[]>(slides);
  const { width: screenWidth } = useWindowDimensions();

  const _itemWidth = screenWidth;
  const _itemHeight = _itemWidth;

  const translateX = useSharedValue(_itemWidth);

  // Ref to track current extended slides length without causing effect re-runs
  // Used to check if we need to push more items when approaching the end
  const extendedSlidesLengthRef = useRef(slides.length);

  const animatedIndex = useDerivedValue(() => {
    return translateX.get() / _itemWidth;
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -translateX.get() }],
    };
  });

  useEffect(() => {
    setExtendedSlides(slides);
    extendedSlidesLengthRef.current = slides.length;
  }, [slides]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTranslateX = translateX.get();
      const currentIndex = Math.floor(currentTranslateX / _itemWidth);
      const nextIndex = currentIndex + 1;
      const currentExtendedLength = extendedSlidesLengthRef.current;

      if (nextIndex >= currentExtendedLength - 2) {
        setExtendedSlides((prev) => {
          const newSlides = [...prev, ...slides];
          extendedSlidesLengthRef.current = newSlides.length;
          return newSlides;
        });
      }

      translateX.set(withSpring(nextIndex * _itemWidth, SPRING_CONFIG));
    }, 2000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [slides, _itemWidth, translateX]);

  return (
    <View
      style={{ height: _itemHeight, width: screenWidth }}
      pointerEvents="none"
      className="overflow-hidden"
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            height: _itemHeight,
          },
          rContainerStyle,
        ]}
      >
        {extendedSlides.map((slide, index) => (
          <CarouselItem
            key={`${slide.id}-${index}`}
            index={index}
            itemWidth={_itemWidth}
            itemHeight={_itemHeight}
            slide={slide}
            animatedIndex={animatedIndex}
          />
        ))}
      </Animated.View>
    </View>
  );
};
