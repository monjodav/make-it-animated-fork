import { FlatList } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";

/**
 * Represents a single slide in the onboarding carousel
 */
export type OnboardingSlide = {
  /** Background color of the slide */
  bgColor: string;
  /** Duration in milliseconds for the slide's progress animation */
  duration: number;
  /** Title of the slide */
  title: string;
};

export type CarouselProps = {
  SLIDES: OnboardingSlide[];
  setCurrentSlideIndex: (index: number) => void;
  horizontalListRef: React.RefObject<FlatList<OnboardingSlide> | null>;
  scrollHandler: (event: any) => void;
  currentSlideIndex: number;
  translateY: SharedValue<number>;
  scrollOffsetX: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  animatedSlideIndex: SharedValue<number>;
  topCarouselOffset: number;
};
