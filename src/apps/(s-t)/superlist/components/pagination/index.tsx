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

  const totalItems = slides.length + 2; // We add here because we have 2 extra widths for the active item
  const itemWidth = (totalPaginationWidth - totalGaps) / totalItems;

  const inactiveWidth = itemWidth;
  const activeWidth = itemWidth * 3;

  return (
    <View
      className="flex-row items-center justify-center pb-4 px-20"
      style={{ gap: GAP, paddingHorizontal: HORIZONTAL_PADDING / 2 }}
    >
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
