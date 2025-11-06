import { FC } from "react";
import { View, useWindowDimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { OnboardingSlide } from "../lib/types";
import { PaginationItem } from "./pagination-item";

type PaginationProps = {
  slides: OnboardingSlide[];
  currentSlideIndex: number;
  animatedSlideIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  handleScrollToIndex: (index: number) => void;
  translateY: SharedValue<number>;
  topCarouselOffset: number;
};

export const Pagination: FC<PaginationProps> = ({
  slides,
  currentSlideIndex,
  animatedSlideIndex,
  isDragging,
  handleScrollToIndex,
  translateY,
  topCarouselOffset,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const HORIZONTAL_PADDING = screenWidth * 0.25;
  const GAP = 3;

  const totalPaginationWidth = screenWidth - HORIZONTAL_PADDING;
  const totalGaps = (slides.length - 1) * GAP;

  const totalItems = slides.length + 2;
  const itemWidth = (totalPaginationWidth - totalGaps) / totalItems;
  const inactiveWidth = itemWidth;
  const activeWidth = itemWidth * 3;

  return (
    <View className="flex-row items-center justify-center pt-5 pb-4 px-20" style={{ gap: GAP }}>
      {slides.map((slide, index) => (
        <PaginationItem
          key={index}
          index={index}
          currentSlideIndex={currentSlideIndex}
          animatedSlideIndex={animatedSlideIndex}
          inactiveWidth={inactiveWidth}
          activeWidth={activeWidth}
          totalSlides={slides.length}
          isDragging={isDragging}
          slideDuration={slide.duration}
          handleScrollToIndex={handleScrollToIndex}
          translateY={translateY}
          topCarouselOffset={topCarouselOffset}
        />
      ))}
    </View>
  );
};

export default Pagination;
