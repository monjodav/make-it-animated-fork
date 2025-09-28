import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedProps,
  Extrapolation,
} from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { memo } from "react";
import { cn } from "@/src/shared/lib/utils/cn";

// opal-blurred-carousel-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CarouselItemProps {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  screenWidth: number;
  horizontalPadding: number;
  innerPadding: number;
}

const CarouselItem = ({
  item,
  index,
  scrollX,
  itemWidth,
  screenWidth,
  horizontalPadding,
  innerPadding,
}: CarouselItemProps) => {
  const rItemStyle = useAnimatedStyle(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;

    const partiallyVisibleRange = itemWidth * 1.5;

    const scale = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.88],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const rBlurProps = useAnimatedProps(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    const blurIntensity = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      intensity: blurIntensity,
    };
  });

  const _innerPadding = Math.max(innerPadding ?? 0, 6);

  return (
    <AnimatedPressable
      style={[{ width: itemWidth, padding: _innerPadding }, rItemStyle]}
      className="aspect-[2/3] self-start overflow-hidden"
      onPress={simulatePress}
    >
      <Animated.View
        className={cn(
          "flex-1 p-3 rounded-[30px] overflow-hidden border border-white/40",
          Platform.OS === "android" && "border-white/10"
        )}
        style={styles.cardContainer}
      >
        <Image
          contentFit="cover"
          placeholder={{ blurhash: item }}
          style={[StyleSheet.absoluteFill, styles.image]}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.95)", "black", "black"]}
          locations={[0, 0.81, 0.88, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View className="mt-auto">
          <View className="mb-2 w-20 h-4 rounded-full bg-neutral-800/70" />
          <View className="mb-1 h-3 rounded-full bg-neutral-800/70" />
          <View className="mb-4 w-3/4 h-3 rounded-full bg-neutral-800/70" />
          <View className="flex-row justify-center items-center gap-1 rounded-full bg-neutral-800/70 p-1">
            <Plus size={15} color="#d4d4d4" strokeWidth={2.5} />
            <Text className="text-md text-neutral-300 font-semibold">Add </Text>
          </View>
        </View>
      </Animated.View>

      {Platform.OS === "ios" && (
        <AnimatedBlurView
          animatedProps={rBlurProps}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderCurve: "continuous",
    borderWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
  },
  image: {
    borderRadius: 30,
  },
});

export default memo(CarouselItem);

// opal-blurred-carousel-animation 🔼
