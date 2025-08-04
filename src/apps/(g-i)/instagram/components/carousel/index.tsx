import type React from "react";
import { useCallback, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { FlatList, View, type ViewToken } from "react-native";
import { CarouselContext, CarouselImage } from "./carousel-context";

// instagram-pagination-dots-animation 🔽

export interface CarouselProps extends PropsWithChildren {
  images: CarouselImage[];
  className?: string;
}

export function Carousel({ images, children, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDotsPressed, setIsDotsPressed] = useState(false);
  const [viewableItems, setViewableItems] = useState<ViewToken<CarouselImage>[]>([]);

  const carouselRef = useRef<FlatList<CarouselImage>>(null);
  const dotsListRef = useRef<FlatList<string>>(null);
  const refIndex = useRef(0);

  // Tracks which carousel images are currently visible and syncs dots list position
  // Uses 55% visibility threshold (set in CarouselContent) for accurate pagination
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<CarouselImage>[] }) => {
      setViewableItems(viewableItems);

      if (viewableItems.length > 0) {
        const currentIndex = viewableItems[0].index ?? 0;

        // Prevent index updates during manual dots interaction to avoid conflicts
        if (!isDotsPressed) {
          setCurrentIndex(currentIndex);
        }

        // Smart dots list scrolling: keep current dot within visible viewport
        // When user scrolls beyond 2 dots ahead, shift dots list to maintain visibility
        if (currentIndex - refIndex.current > 2) {
          refIndex.current = currentIndex - 2; // Keep 2 dots before current visible
          dotsListRef.current?.scrollToIndex({
            animated: true,
            index: currentIndex - 2,
          });
        }

        // When scrolling backwards, ensure current dot stays visible
        if (currentIndex - refIndex.current < 0) {
          refIndex.current = currentIndex;
          dotsListRef.current?.scrollToIndex({
            animated: true,
            index: currentIndex,
          });
        }
      }
    },
    [isDotsPressed]
  );

  // Fallback for when dots list scrollToIndex fails (e.g., rapid navigation)
  // Immediately jumps carousel to current index without animation to maintain sync
  const onScrollToIndexFailed = useCallback(() => {
    carouselRef.current?.scrollToIndex({
      animated: false, // Instant jump prevents visual glitches
      index: currentIndex,
    });
  }, [currentIndex]);

  const value = {
    images,
    currentIndex,
    setCurrentIndex,
    carouselRef,
    dotsListRef,
    isDotsPressed,
    setIsDotsPressed,
    onViewableItemsChanged,
    onScrollToIndexFailed,
    viewableItems,
  };

  return (
    <CarouselContext.Provider value={value}>
      <View className={className}>{children}</View>
    </CarouselContext.Provider>
  );
}

export { useCarousel } from "./carousel-context";
export type { CarouselImage } from "./carousel-context";
export { CarouselContent } from "./carousel-content";
export { CarouselPagination } from "./carousel-pagination";

// instagram-pagination-dots-animation 🔼
