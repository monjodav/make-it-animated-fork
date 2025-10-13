import { View, Text, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Dots } from "../components/dots";
import { GradientLayer } from "../components/gradient-layer";

const DATA = Array.from({ length: 5 });
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
    const lastIndex = DATA.length - 1;
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
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {DATA.map((_, index) => (
          <View
            style={{ width, backgroundColor: index % 2 === 0 ? "#161522" : "#8e9343ff" }}
            className="h-full"
            key={index}
          ></View>
        ))}
      </Animated.ScrollView>

      <View pointerEvents="none" className="absolute bottom-0 w-full justify-center">
        {PALETTE.map((color, i) => (
          <GradientLayer
            key={i}
            color={color}
            index={i}
            width={width}
            height={height}
            scrollOffsetX={scrollOffsetX}
          />
        ))}

        <View className="absolute bottom-0 w-full px-5 self-center mb-12">
          <Dots numberOfDots={DATA.length} activeIndex={activeIndex} />
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
