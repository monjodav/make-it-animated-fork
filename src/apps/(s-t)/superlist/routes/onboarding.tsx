import { ChevronDown, Mail, UserRound } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingSlide } from "../components/lib/types";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Carousel from "../components/carousel";
import AntDesign from "@expo/vector-icons/AntDesign";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { scheduleOnRN } from "react-native-worklets";
import { LinearGradient } from "expo-linear-gradient";

export const SLIDES: OnboardingSlide[] = [
  {
    bgColor: "#7872E0",
    duration: 3000,
    title: "Create tasks at the speed of thought",
  },
  {
    bgColor: "#FB5A44",
    duration: 3000,
    title: "Take notes and transform thoughts into action",
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
    title: "Start your next project in seconds using AI templates",
  },
  {
    bgColor: "#2188DA",
    duration: 2000,
    title: "Organize your team with shared lists and tasks",
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
    title: "Get things done with a bit more fun",
  },
];

const TOP_CAROUSEL_OFFSET = 230;
const SWIPE_UP_THRESHOLD = 20;

export const Onboarding = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const horizontalListRef = useRef<FlatList>(null);

  // Current slide index in the carousel (1-based due to cloned slides)
  const animatedSlideIndex = useSharedValue(1);
  // Horizontal scroll offset for slide animations
  const scrollOffsetX = useSharedValue(0);
  // Whether user is currently dragging the carousel
  const isDragging = useSharedValue(false);
  // Vertical translation for swipe up gesture
  const translateY = useSharedValue(0);
  // Track gesture start position to accumulate deltas correctly
  const gestureStartY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.set(true);
    },
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      animatedSlideIndex.set(offsetX / screenWidth);
    },
    onEndDrag: () => {
      isDragging.set(false);
    },
  });

  const handleScrollToIndex = useCallback((index: number) => {
    horizontalListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }, []);

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      if (translateY.get() < 0) return;
      scheduleOnRN(handleScrollToIndex, currentSlideIndex + 1);
      isDragging.set(false);
    });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.set(true);
      // Remember where we started this gesture
      gestureStartY.set(translateY.get());
    })
    .onUpdate((e) => {
      // Forbid further swipe up when container is already at the top offset
      if (translateY.get() <= -TOP_CAROUSEL_OFFSET && e.translationY < 0) {
        return;
      }

      // Calculate new position relative to gesture start, with a damping factor for a nicer feel
      const proposed = gestureStartY.get() + e.translationY / 4;
      // Clamp between fully down (0) and fully up (-TOP_CAROUSEL_OFFSET)
      const clamped = Math.min(0, Math.max(proposed, -TOP_CAROUSEL_OFFSET));
      translateY.set(clamped);
    })
    .onEnd((e) => {
      const currentY = translateY.get();

      const isExpanded = currentY < 0;

      const isTopThresholdReached =
        Math.abs(gestureStartY.get()) - Math.abs(currentY) > SWIPE_UP_THRESHOLD;

      const isBottomThresholdReached =
        Math.abs(currentY) - Math.abs(gestureStartY.get()) > SWIPE_UP_THRESHOLD;

      const expandedPositionMap = isTopThresholdReached ? 0 : -TOP_CAROUSEL_OFFSET;
      const collapsedPositionMap = isBottomThresholdReached ? -TOP_CAROUSEL_OFFSET : 0;

      const target = isExpanded ? expandedPositionMap : collapsedPositionMap;

      translateY.set(
        withSpring(target, {}, (finished) => {
          if (finished && target === 0) {
            isDragging.set(false);
          }
        })
      );
    });

  const rButtonsBlockStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.get(),
        [0, -TOP_CAROUSEL_OFFSET],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const rSignUpStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.get(),
            [0, -TOP_CAROUSEL_OFFSET],
            [0, -40],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const rContinueWithEmailStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translateY.get(),
            [0, -TOP_CAROUSEL_OFFSET],
            [40, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const rGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.get(),
        [0, -TOP_CAROUSEL_OFFSET],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const slideBottomHandler = () => {
    isDragging.set(false);
    translateY.set(
      withTiming(0, {
        duration: 300,
      })
    );
  };

  return (
    <GestureDetector gesture={Gesture.Race(panGesture, singleTap)}>
      <View className="flex-1 bg-slate-900" style={{ paddingBottom: insets.bottom + 10 }}>
        <Animated.View className="mt-auto" style={[rButtonsBlockStyle]}>
          <Pressable className="self-center mb-6" onPress={slideBottomHandler}>
            <ChevronDown size={26} color="grey" />
          </Pressable>
          <Text className="text-white text-center text-4xl font-bold">Let's get started</Text>
          <Text className="text-slate-400 text-center mt-3">
            Sign in to get things done - your task,
          </Text>
          <Text className="text-slate-400 text-center">notes, and meetings all in one place</Text>
          <Pressable
            onPress={simulatePress}
            style={{ borderCurve: "continuous" }}
            className="flex-row h-[40px] items-center justify-center gap-2 rounded-full mx-20 mt-8 bg-white"
          >
            <AntDesign name="google" size={24} color="black" />
            <Text className="text-black">Continue with Google</Text>
          </Pressable>
          <Pressable
            onPress={simulatePress}
            style={{ borderCurve: "continuous" }}
            className="flex-row h-[40px] items-center justify-center gap-2 rounded-full mx-20 mt-3 bg-white"
          >
            <AntDesign name="apple" size={24} color="black" />
            <Text className="text-black">Continue with Apple</Text>
          </Pressable>
        </Animated.View>
        <Pressable
          onPress={simulatePress}
          style={{ borderCurve: "continuous" }}
          className="h-[40px] items-center justify-center rounded-full mx-20 mt-3 bg-slate-700 overflow-hidden"
        >
          <Animated.View className="flex-row gap-2 pt-0" style={rSignUpStyle}>
            <UserRound size={16} color="white" />
            <Text className="text-white">Sign Up / Sign In</Text>
          </Animated.View>
          <Animated.View className="flex-row gap-2 -mt-5" style={rContinueWithEmailStyle}>
            <Mail size={16} color="white" />
            <Text className="text-white">Continue with email</Text>
          </Animated.View>
        </Pressable>

        <Carousel
          SLIDES={SLIDES}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          animatedSlideIndex={animatedSlideIndex}
          horizontalListRef={horizontalListRef}
          scrollHandler={scrollHandler}
          translateY={translateY}
          scrollOffsetX={scrollOffsetX}
          isDragging={isDragging}
          topCarouselOffset={TOP_CAROUSEL_OFFSET}
        />

        <Animated.View className="absolute inset-0 pointer-events-none" style={rGradientStyle}>
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={{ width: "100%", height: "60%" }}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
