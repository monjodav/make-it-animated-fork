import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
} from "react-native";
import Animated, {
  useAnimatedProps,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

// fuse-info-cards-carousel-animation 🔽

// Wrap BlurView so its props can be driven by Reanimated on the UI thread
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Horizontal easing buffer that prevents the incoming/outgoing card from looking "snapped"
// Acts as a small overlap so translateX doesn't stop exactly at width * fraction
const _translateXGap = 25;

interface Props {
  index: number;
  scrollOffsetX: SharedValue<number>;
}

export const InfoItem: React.FC<Props> = ({ index, scrollOffsetX }) => {
  const { width: itemWidth } = useWindowDimensions();

  // Press feedback scale; kept as shared value to avoid re-renders on press
  const scale = useSharedValue(1);

  // Card cross-fade and slide-in/out around the page index
  const rCardStyle = useAnimatedStyle(() => {
    // Normalize scroll to page-based index (0,1,2...) so math is layout-agnostic
    const progress = scrollOffsetX.get() / itemWidth;

    // Cross-fade: fully visible at this index → fade to 0 by 70% into next page
    const fadeOut = interpolate(progress, [index, index + 0.7], [1, 0], Extrapolation.CLAMP);
    // Cross-fade in: start appearing 30% before reaching this page → fully visible at index
    const fadeIn = interpolate(progress, [index - 0.3, index], [0, 1], Extrapolation.CLAMP);

    // Slide out to the right as we leave this page; 70% of width minus gap for subtle easing
    const translateXOut = interpolate(
      progress,
      [index, index + 0.7],
      [0, itemWidth * 0.7 - _translateXGap],
      Extrapolation.CLAMP
    );
    // Slide in from the left before we reach this page; begin 30% width ahead plus gap
    const translateXIn = interpolate(
      progress,
      [index - 0.3, index],
      [-itemWidth * 0.3 + _translateXGap, 0],
      Extrapolation.CLAMP
    );

    return {
      // Multiplying fades gives a soft cross-over only around the active index
      opacity: fadeOut * fadeIn,
      transform: [
        {
          translateX: translateXOut + translateXIn,
        },
        {
          // Press feedback subtlety; 0.99 to avoid layout jank but keep tactile feel
          scale: scale.get(),
        },
      ],
    };
  });

  // Drive BlurView intensity based on distance from the center page
  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      scrollOffsetX.get(),
      [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
      [50, 0, 50],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });

  return (
    <Pressable
      className="px-5"
      style={{ width: itemWidth }}
      onPressIn={() => {
        // Quick 100ms press-in for responsive touch feedback
        scale.value = withTiming(0.99, { duration: 100 });
        if (Platform.OS === "android") {
          // Android note: this carousel is visually disabled due to nested horizontal lists
          // and the delicate cross-fade/slide transitions performing poorly on Android
          Alert.alert(
            "Note",
            `
This component is disabled on Android for two reasons:
1. Nested horizontal list inside parent horizontal list performs poorly on Android
2. Tricky entering and exiting interpolation of carousel card works poorly on Android
`
          );
        }
      }}
      onPressOut={() => {
        // No duration specified → default timing for smooth release
        scale.set(withTiming(1));
      }}
    >
      <Animated.View
        className="flex-row items-center gap-5 h-20 rounded-2xl bg-stone-50 overflow-hidden px-5 py-3 border border-neutral-200"
        style={rCardStyle}
      >
        <View
          className="bg-neutral-800 h-full aspect-square rounded-xl items-center justify-center"
          style={styles.borderCurve}
        >
          <Text className="font-semibold text-stone-300">{index + 1}</Text>
        </View>
        <View className="flex-1 gap-2">
          <View className="w-1/2 h-3 rounded-full bg-neutral-800" />
          <View className="w-2/3 h-2 rounded-full bg-neutral-400" />
        </View>
        <AnimatedBlurView
          // Blur intensity updates on UI thread via animatedProps for smoothness
          animatedProps={blurAnimatedProps}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    // iOS 16+ continuous curves feel more premium; safe on Android as a no-op
    borderCurve: "continuous",
  },
});

// fuse-info-cards-carousel-animation 🔼
