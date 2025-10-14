import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { PaginationDots } from "../components/pagination-dots";
import { GradientLayer } from "../components/gradient-layer";
import { OnboardingSlide } from "../components/onboarding-slide";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PAGES = [
  {
    title: "Welcome to your\nLongevity Deck",
    body: "Your personal guide to evidence-based health and longevity protocols. Swipe cards into your own deck and track what you do, learn from it, and share with others. Privately.",
  },
  {
    title: "Cut through the noise.\nEssentials only!",
    body: "Each protocol is a beautiful card. See benefits, risks, and best practices baked in. Keep only what fits your goals. Filter, search, learn and discover new things!",
  },
  {
    title: "Up to date expert\nbacked info",
    body: "We pull fresh insights from top podcasts and scientific publications. Then update every card with sources, and alert you when anything changes. Never miss a beat!",
  },
  {
    title: "Share with friends\n& compare",
    body: "Publish your stack as one link, let friends copy it in a tap, and see public adoption and weekly-use stats. You can also share a specific protocol you do on social media!",
  },
  {
    title: "This app is not\nmedical advice",
    body: "Educational use only. Not a diagnosis/treatment tool. Protocols may not suit you and could interact with meds or conditions. Do you research and consult a licensed clinician before starting or changing anything. Seek immediate care for symptoms or emergencies. Tap 'I understand' to acknowledge.",
  },
];
const PALETTE = ["#321A48", "#192444", "#1C3F2D", "#44382A", "#391C1D"];

const Onboarding = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const scrollOffsetX = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    scrollOffsetX.set(offsetX);
    activeIndex.set(offsetX / width);
  });

  const rButtonStyle = useAnimatedStyle(() => {
    const beforeLastIndex = PAGES.length - 2;
    const lastIndex = PAGES.length - 1;

    return {
      opacity: interpolate(
        activeIndex.get(),
        [beforeLastIndex, lastIndex],
        [0, 1],
        Extrapolation.CLAMP
      ),
      pointerEvents: activeIndex.get() === lastIndex ? "auto" : "none",
    };
  }, [width]);

  return (
    <View className="flex-1 bg-[#161522]">
      <GradientLayer palette={PALETTE} width={width} height={height} activeIndex={activeIndex} />

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {PAGES.map((page, index) => (
          <OnboardingSlide
            key={index}
            width={width}
            title={page.title}
            body={page.body}
            topOffset={410}
          />
        ))}
      </Animated.ScrollView>

      <View className="absolute left-6 right-6 gap-5" style={{ bottom: insets.bottom + 12 }}>
        <PaginationDots numberOfDots={PAGES.length} activeIndex={activeIndex} />
        <AnimatedPressable
          className="h-[50px] rounded-full bg-white justify-center items-center"
          style={[rButtonStyle, styles.borderCurve]}
        >
          <Text className="text-black text-xl font-medium">I understand</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

export default Onboarding;
