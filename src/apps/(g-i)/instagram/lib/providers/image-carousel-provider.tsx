import { createContext, FC, PropsWithChildren, useContext, useRef, useState } from "react";
import { FlatList } from "react-native";

type ContextValue = {
  images: number[];
  imageIndex: number;
  setImageIndex: (index: number) => void;
  carouselRef: React.RefObject<FlatList<any>>;
  dotsListRef: React.RefObject<FlatList<any>>;
  isDotsPressed: boolean;
  setIsDotsPressed: (value: boolean) => void;
};

const ImageCarouselContext = createContext<ContextValue>({} as ContextValue);

export const ImageCarouselProvider: FC<PropsWithChildren> = ({ children }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isDotsPressed, setIsDotsPressed] = useState(false);

  const carouselRef = useRef<FlatList>(null);
  const dotsListRef = useRef<FlatList>(null);

  const images = Array.from({ length: 11 }).map((_, index) => index);

  const value = {
    images,
    imageIndex,
    setImageIndex,
    carouselRef,
    dotsListRef,
    isDotsPressed,
    setIsDotsPressed,
  };

  return <ImageCarouselContext.Provider value={value}>{children}</ImageCarouselContext.Provider>;
};

export const useImageCarousel = () => {
  const context = useContext(ImageCarouselContext);

  if (!context) {
    throw new Error("useImageCarousel must be used within an ImageCarouselProvider");
  }

  return context;
};
