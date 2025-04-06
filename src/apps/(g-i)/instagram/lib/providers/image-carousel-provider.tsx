import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { FlatList, View, ViewToken } from "react-native";

// instagram-image-carousel-animation 🔽

type ContextValue = {
  images: number[];
  imageIndex: number;
  setImageIndex: (index: number) => void;
  carouselRef: React.RefObject<FlatList<any>>;
  dotsListRef: React.RefObject<FlatList<any>>;
  isDotsPressed: boolean;
  setIsDotsPressed: (value: boolean) => void;
  onViewableItemsChanged: (info: { viewableItems: ViewToken<any>[] }) => void;
  onScrollToIndexFailed: () => void;
};

const ImageCarouselContext = createContext<ContextValue>({} as ContextValue);

type Props = {
  images: number[];
};

export const ImageCarouselProvider: FC<PropsWithChildren<Props>> = ({ children, images }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isDotsPressed, setIsDotsPressed] = useState(false);

  const carouselRef = useRef<FlatList>(null);
  const dotsListRef = useRef<FlatList>(null);

  const refIndex = useRef(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<any>[] }) => {
      if (viewableItems.length > 0) {
        const currentIndex = viewableItems[0].index ?? 0;

        if (!isDotsPressed) {
          setImageIndex(currentIndex);
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
      index: imageIndex,
    });
  }, [imageIndex, carouselRef]);

  const value = {
    images,
    imageIndex,
    setImageIndex,
    carouselRef,
    dotsListRef,
    isDotsPressed,
    setIsDotsPressed,
    onViewableItemsChanged,
    onScrollToIndexFailed,
  };

  return (
    <ImageCarouselContext.Provider value={value}>
      <View>{children}</View>
    </ImageCarouselContext.Provider>
  );
};

export const useImageCarousel = () => {
  const context = useContext(ImageCarouselContext);

  if (!context) {
    throw new Error("useImageCarousel must be used within an ImageCarouselProvider");
  }

  return context;
};

// instagram-image-carousel-animation 🔼
