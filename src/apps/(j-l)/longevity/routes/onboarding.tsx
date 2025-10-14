import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Dots } from "../components/dots";
import { GradientLayer } from "../components/gradient-layer";
import { OnboardingPage } from "../components/onboarding-page";

const PAGES = [
  {
    title: "Welcome to your Longevity Deck",
    body: "Your personal guide to evidence-based health and longevity protocols. Swipe cards into your own deck and track what you do, learn from it, and share with others. Privately.",
  },
  {
    title: "Cut through the noise. Essentials only!",
    body: "Each protocol is a beautiful card. See benefits, risks, and best practices baked in. Keep only what fits your goals. Filter, search, learn and discover new things!",
  },
  {
    title: "Up to date expert backed info",
    body: "We pull fresh insights from top podcasts and scientific publications. Then update every card with sources, and alert you when anything changes. Never miss a beat!",
  },
  {
    title: "Share with friends & compare",
    body: "Publish your stack as one link, let friends copy it in a tap, and see public adoption and weekly-use stats. You can also share a specific protocol you do on social media!",
  },
  {
    title: "This app is not medical advice",
    body: "Educationl use only. Not a diagnosis/treatment tool. Protocols may not suit you and could interact with meds or conditions. Do you research and consult a licensed clinician before starting or changing anything. Seek immediate care for symptoms or emergencies. Tap 'I understand' to acknowledge.",
  },
];
const PALETTE = ["#321A48", "#192444", "#1C3F2D", "#44382A", "#391C1D"];

const Onboarding = () => {
  const { width, height } = useWindowDimensions();

  const scrollOffsetX = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    scrollOffsetX.set(offsetX);
    activeIndex.set(Math.floor(offsetX / width));
  });

  const rButtonStyle = useAnimatedStyle(() => {
    const lastIndex = PAGES.length - 1;
    const centerLast = lastIndex * width;
    const startFade = centerLast - width * 0.7;
    const opacity = interpolate(
      scrollOffsetX.get() ?? 0,
      [startFade, centerLast],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, [width]);

  return (
    <View className="flex-1 bg-[#161522]">
      <GradientLayer
        palette={PALETTE}
        width={width}
        height={height}
        scrollOffsetX={scrollOffsetX}
      />

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {PAGES.map((page, index) => (
          <OnboardingPage
            key={index}
            width={width}
            title={page.title}
            body={page.body}
            topOffset={410}
          />
        ))}
      </Animated.ScrollView>

      <View
        pointerEvents="none"
        className="absolute w-full justify-center"
        style={StyleSheet.absoluteFill}
      >
        <View className="absolute bottom-0 w-full px-5 self-center mb-12">
          <Dots numberOfDots={PAGES.length} activeIndex={activeIndex} />
          <Animated.View
            style={rButtonStyle}
            className="h-[50px] mt-5 rounded-full bg-white justify-center items-center self-stretch"
          >
            <Text className="text-black text-xl text-nowrap font-medium"> I understand</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
