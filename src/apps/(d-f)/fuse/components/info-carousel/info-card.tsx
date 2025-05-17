import { Alert, Platform, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
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

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// On card change, this is a distance the card passes from it comes fully visible to final position
const _translateXGap = 25;

interface Props {
  index: number;
  scrollOffsetX: SharedValue<number>;
}

export const InfoItem: React.FC<Props> = ({ index, scrollOffsetX }) => {
  const { width: itemWidth } = useWindowDimensions();

  const scale = useSharedValue(1);

  const rCardStyle = useAnimatedStyle(() => {
    const progress = scrollOffsetX.value / itemWidth;

    const fadeOut = interpolate(progress, [index, index + 0.7], [1, 0], Extrapolation.CLAMP);
    const fadeIn = interpolate(progress, [index - 0.3, index], [0, 1], Extrapolation.CLAMP);

    const translateXOut = interpolate(
      progress,
      [index, index + 0.7],
      [0, itemWidth * 0.7 - _translateXGap],
      Extrapolation.CLAMP
    );
    const translateXIn = interpolate(
      progress,
      [index - 0.3, index],
      [-itemWidth * 0.3 + _translateXGap, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: fadeOut * fadeIn,
      transform: [
        {
          translateX: translateXOut + translateXIn,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      scrollOffsetX.value,
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
        scale.value = withTiming(0.99, { duration: 100 });
        if (Platform.OS === "android") {
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
        scale.value = withTiming(1);
      }}
    >
      <Animated.View
        className="flex-row items-center gap-5 h-20 rounded-2xl bg-stone-50 overflow-hidden px-5 py-3 border border-neutral-200"
        style={rCardStyle}
      >
        <View
          className="bg-neutral-800 h-full aspect-square rounded-xl"
          style={styles.borderCurve}
        />
        <View className="flex-1 gap-2">
          <View className="w-1/2 h-3 rounded-full bg-neutral-800" />
          <View className="w-2/3 h-2 rounded-full bg-neutral-400" />
        </View>
        <AnimatedBlurView
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
    borderCurve: "continuous",
  },
});

// fuse-info-cards-carousel-animation 🔼
