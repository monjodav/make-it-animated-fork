import type React from "react";
import { createContext, useContext } from "react";
import type { FlatList, ViewToken } from "react-native";

// instagram-pagination-dots-animation 🔽

export type CarouselImage = number; // Type for demo, in real project would be {uri: string, blurhash: string}

export type CarouselContextValue = {
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

export const CarouselContext = createContext<CarouselContextValue | undefined>(undefined);

export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }

  return context;
}

// instagram-pagination-dots-animation 🔼
