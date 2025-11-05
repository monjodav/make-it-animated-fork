import { ChevronDown, Mail, UserRound } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingSlide } from "../components/lib/types";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Carousel from "../components/carousel";
import AntDesign from "@expo/vector-icons/AntDesign";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

export const SLIDES: OnboardingSlide[] = [
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
  {
    bgColor: "#FB5A44",
    duration: 3000,
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
  {
    bgColor: "#2188DA",
    duration: 2000,
  },
  {
    bgColor: "#7872E0",
    duration: 3000,
  },
];

const VERTICAL_SWIPE_THRESHOLD = 50;
const TOP_CAROUSEL_OFFSET = 230;

export const Onboarding = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);

  const data = useMemo(() => [SLIDES.at(-1)!, ...SLIDES, SLIDES.at(0)!], []);

  // Current slide index in the carousel (1-based due to cloned slides)
  const animatedSlideIndex = useSharedValue(1);
  // Horizontal scroll offset for slide animations
  const scrollOffsetX = useSharedValue(0);
  // Whether user is currently dragging the carousel
  const isDragging = useSharedValue(false);
  // Vertical translation for swipe up gesture
  const translateY = useSharedValue(0);

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

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only allow upward movement (negative translationY)
      if (e.translationY < 0) {
        // Calculate max translation (move carousel above the content)
        const maxTranslation = -(screenHeight - insets.top - insets.bottom - 40);
        translateY.set(Math.max(e.translationY, maxTranslation) / 4);
      }
    })
    .onEnd((e) => {
      const threshold = -VERTICAL_SWIPE_THRESHOLD;

      if (translateY.get() < threshold) {
        // Complete the swipe up
        translateY.set(
          withTiming(-TOP_CAROUSEL_OFFSET, {
            duration: 300,
          })
        );
      } else {
        // Snap back to original position
        translateY.set(
          withTiming(0, {
            duration: 300,
          })
        );
      }
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

  return (
    <GestureDetector gesture={panGesture}>
      <View className="flex-1 bg-slate-900" style={[{ paddingBottom: insets.bottom + 10 }]}>
        <Animated.View className="mt-auto" style={[rButtonsBlockStyle]}>
          <Pressable
            className="self-center mb-6"
            onPress={() => {
              translateY.set(
                withTiming(0, {
                  duration: 300,
                })
              );
            }}
          >
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
          setCurrentSlideIndex={setCurrentSlideIndex}
          horizontalListRef={horizontalListRef}
          scrollHandler={scrollHandler}
          data={data}
          currentSlideIndex={currentSlideIndex}
          translateY={translateY}
          scrollOffsetX={scrollOffsetX}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          SLIDES={SLIDES}
          isDragging={isDragging}
          animatedSlideIndex={animatedSlideIndex}
        />
      </View>
    </GestureDetector>
  );
};
