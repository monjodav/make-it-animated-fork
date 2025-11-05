import { FlatList } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";

/**
 * Represents a single slide in the onboarding carousel
 */
export type OnboardingSlide = {
  /** Background color of the slide */
  bgColor: string;
  /** Duration in milliseconds for the slide's progress animation */
  duration: number;
};

export type CarouselProps = {
  setCurrentSlideIndex: (index: number) => void;
  horizontalListRef: React.RefObject<FlatList<any> | null>;
  scrollHandler: (event: any) => void;
  data: Array<OnboardingSlide>;
  currentSlideIndex: number;
  translateY: SharedValue<number>;
  scrollOffsetX: SharedValue<number>;
  screenHeight: number;
  screenWidth: number;
  SLIDES: Array<OnboardingSlide>;
  isDragging: SharedValue<boolean>;
  animatedSlideIndex: SharedValue<number>;
};
