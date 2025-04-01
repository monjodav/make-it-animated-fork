import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ContextValue = {
  images: number[];
  totalImages: number;
  index: number;
  setIndex: (index: number) => void;
  activeImageIndex: SharedValue<number>;
  prevImageIndex: SharedValue<number>;
};

const ImageCarouselContext = createContext<ContextValue>({} as ContextValue);

export const ImageCarouselProvider: FC<PropsWithChildren> = ({ children }) => {
  const [index, setIndex] = useState(0); // This state is for demo only

  const images = Array.from({ length: 10 }).map((_, index) => index);

  const activeImageIndex = useSharedValue(0);
  const prevImageIndex = useSharedValue(0);

  const value = {
    images,
    totalImages: images.length,
    index,
    setIndex,
    activeImageIndex,
    prevImageIndex,
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
