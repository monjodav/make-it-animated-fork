import type React from "react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { FlatList, View, type ViewToken } from "react-native";

// instagram-pagination-dots-animation 🔽

// Type number is for demo only. In real project you will have something like:
// {uri: string, blurhash: string}
export type CarouselImage = number;

type CarouselContextValue = {
  images: CarouselImage[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  carouselRef: React.RefObject<FlatList<CarouselImage>>;
  dotsListRef: React.RefObject<FlatList<string>>;
  isDotsPressed: boolean;
  setIsDotsPressed: (value: boolean) => void;
  onViewableItemsChanged: (info: { viewableItems: ViewToken<CarouselImage>[] }) => void;
  onScrollToIndexFailed: () => void;
  viewableItems?: ViewToken<CarouselImage>[];
};

const CarouselContext = createContext<CarouselContextValue | undefined>(undefined);

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

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<CarouselImage>[] }) => {
      setViewableItems(viewableItems);

      if (viewableItems.length > 0) {
        const currentIndex = viewableItems[0].index ?? 0;

        if (!isDotsPressed) {
          setCurrentIndex(currentIndex);
        }

        if (currentIndex - refIndex.current > 2) {
          refIndex.current = currentIndex - 2;
          dotsListRef.current?.scrollToIndex({
            animated: true,
            index: currentIndex - 2,
          });
        }

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

  const onScrollToIndexFailed = useCallback(() => {
    carouselRef.current?.scrollToIndex({
      animated: false,
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

export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }

  return context;
}

export { CarouselContent } from "./carousel-content";
export { CarouselPagination } from "./carousel-pagination";

// instagram-pagination-dots-animation 🔼
